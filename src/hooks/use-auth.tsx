import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = "current_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          const { data } = await supabase
            .from("users")
            .select("id, username")
            .eq("id", parsed.id)
            .single();
          if (mounted && data) {
            setUser({ id: data.id, username: data.username });
          } else if (mounted) {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
          }
        }
      } catch {
        if (mounted) await AsyncStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (username: string): Promise<{ success: boolean; error?: string }> => {
      const trimmed = username.trim().toLowerCase();
      if (!trimmed) {
        return { success: false, error: "Username is required" };
      }

      try {
        const { data: allowed, error: allowedError } = await supabase
          .from("allowed_users")
          .select("username")
          .eq("username", trimmed)
          .single();

        if (allowedError || !allowed) {
          return { success: false, error: "Username not authorized" };
        }

        let { data: existingUser } = await supabase
          .from("users")
          .select("id, username")
          .eq("username", trimmed)
          .single();

        if (!existingUser) {
          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({ username: trimmed })
            .select("id, username")
            .single();

          if (createError || !newUser) {
            return { success: false, error: "Failed to create user" };
          }
          existingUser = newUser;
        }

        const userObj: User = {
          id: existingUser.id,
          username: existingUser.username,
        };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
        setUser(userObj);
        return { success: true };
      } catch {
        return { success: false, error: "Login failed. Try again." };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
