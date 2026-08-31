// Login screen — email + password form (not yet connected to Firebase).
import { Button, ThemedText, ThemedView } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useExpenses();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ponytail: replace with signInWithEmailAndPassword(auth, email, password) when Firebase is wired
    router.replace("/(tabs)/index");
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
            style={[
              styles.card,
              {
                borderColor: colors.border,
              },
            ]}
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
              <ThemedText
                type="body"
                color="textSecondary"
                style={styles.label}
              >
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

              <ThemedText
                type="body"
                color="textSecondary"
                style={styles.label}
              >
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
            >
              <ThemedText
                type="body"
                color="textOnAccent"
                style={{
                  fontFamily: Fonts.sansSemiBold,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Sign In
              </ThemedText>
            </Button>

            <View style={styles.footer}>
              <ThemedText type="caption" color="textMuted">
                Don&apos;t have an account?{" "}
              </ThemedText>
              <ThemedText type="caption" color="accent">
                Sign Up
              </ThemedText>
            </View>
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
    marginBottom: Spacing.xxl,
  },
  form: {
    marginBottom: Spacing.xl,
  },
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
});
