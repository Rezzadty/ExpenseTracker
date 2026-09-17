import { AnimatedModal, Button, ThemedText, ThemedView } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import ModalNotification from "./modal-notification";

export type ModalSignUpProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ModalSignUp({ visible, onClose }: ModalSignUpProps) {
  const { colors } = useExpenses();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    buttonText?: string;
    onDismiss?: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setNotification({
        visible: true,
        type: "error",
        title: "Missing Fields",
        message: "Please fill in all fields.",
      });
      return;
    }
    if (password !== confirmPassword) {
      setNotification({
        visible: true,
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match. Please verify your password.",
      });
      return;
    }
    if (password.length < 6) {
      setNotification({
        visible: true,
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await signOut(auth);
      setNotification({
        visible: true,
        type: "success",
        title: "Account Created",
        message: "Your account has been created successfully! Please sign in with your credentials.",
        buttonText: "Go to Sign In",
        onDismiss: () => {
          handleClose();
        },
      });
    } catch (e: any) {
      let message = "An error occurred during sign up.";
      if (e.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please sign in instead.";
      } else if (e.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (e.code === "auth/weak-password") {
        message = "Password is too weak. Please use a stronger password.";
      } else if (e.message) {
        message = e.message;
      }
      setNotification({
        visible: true,
        type: "error",
        title: "Sign Up Failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedModal visible={visible && !notification.visible} onClose={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ThemedView
            surface="surface"
            style={[styles.card, { borderColor: colors.border }]}
          >
            <View style={styles.header}>
              <ThemedText
                type="body"
                color="textPrimary"
                style={{
                  fontFamily: Fonts.sansBold,
                  fontWeight: "700",
                  fontSize: 18,
                }}
              >
                Create Account
              </ThemedText>
              <Pressable onPress={handleClose} hitSlop={12}>
                <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>
                  ✕
                </ThemedText>
              </Pressable>
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

              <ThemedText type="body" color="textSecondary" style={styles.label}>
                Confirm Password
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
                placeholder="Re-enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                textContentType="password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <Button
              style={[styles.signupBtn, { backgroundColor: colors.accent }]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <ThemedText
                type="body"
                color="textOnAccent"
                style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600", fontSize: 16 }}
              >
                {loading ? "Creating..." : "Sign Up"}
              </ThemedText>
            </Button>

            <Pressable style={styles.toggleBtn} onPress={handleClose}>
              <ThemedText type="body" color="textMuted">
                Already have an account?{" "}
                <ThemedText
                  type="body"
                  color="accent"
                  style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
                >
                  Sign In
                </ThemedText>
              </ThemedText>
            </Pressable>
          </ThemedView>
        </KeyboardAvoidingView>
      </AnimatedModal>

      <ModalNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        buttonText={notification.buttonText}
        onClose={() => {
          const dismiss = notification.onDismiss;
          setNotification((prev) => ({ ...prev, visible: false }));
          dismiss?.();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.xl,
    borderWidth: 1,
    boxShadow: "0px 8px 24px rgba(0,0,0,0.35)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  signupBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.button,
  },
  toggleBtn: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
});
