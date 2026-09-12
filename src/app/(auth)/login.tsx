import { Button, ThemedText, ThemedView } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { auth } from "@/lib/firebase";
import Constants from "expo-constants";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID ?? "";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function LoginScreen() {
  const { colors } = useExpenses();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: WEB_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type !== "success") return;
    const { id_token } = response.params;
    if (!id_token) {
      Alert.alert("Google sign in failed", "No id_token returned. Check your Google OAuth client configuration.");
      return;
    }
    const credential = GoogleAuthProvider.credential(id_token);
    setLoading(true);
    signInWithCredential(auth, credential)
      .catch((e) => Alert.alert("Google sign in failed", e.message))
      .finally(() => setLoading(false));
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      Alert.alert("Sign in failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ThemedView
            surface="surface"
            style={[styles.card, { borderColor: colors.border }]}
          >
            <View style={styles.header}>
              <ThemedText
                type="money"
                color="accent"
                style={{ fontSize: 36, marginBottom: Spacing.xs }}
              >
                ExpenseTracker
              </ThemedText>
              <ThemedText type="body" color="textMuted">
                Sign in to continue
              </ThemedText>
            </View>

            <View style={styles.form}>
              <ThemedText type="body" color="textSecondary" style={styles.label}>
                Email
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
              />

              <ThemedText type="body" color="textSecondary" style={styles.label}>
                Password
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                textContentType="password"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button
              style={[styles.loginBtn, { backgroundColor: colors.accent }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <ThemedText
                type="body"
                color="textOnAccent"
                style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600", fontSize: 16 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </ThemedText>
            </Button>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <ThemedText type="caption" color="textMuted" style={styles.dividerText}>
                or
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Pressable
              style={[styles.googleBtn, { borderColor: colors.border }]}
              onPress={() => promptAsync()}
              disabled={!request || loading}
            >
              <ThemedText
                type="body"
                color="textPrimary"
                style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600", fontSize: 15 }}
              >
                Sign in with Google
              </ThemedText>
            </Pressable>
          </ThemedView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.base,
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.xl,
    borderWidth: 1,
    boxShadow: "0px 8px 24px rgba(0,0,0,0.25)",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  form: { marginBottom: Spacing.xl },
  label: {
    fontFamily: Fonts.sansSemiBold,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    marginTop: Spacing.base,
  },
  input: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  loginBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.button,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: Spacing.md },
  googleBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.button,
    borderWidth: 1,
  },
});
