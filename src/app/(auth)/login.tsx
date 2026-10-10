import { Button, Input, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useExpenses } from "@/hooks/use-expenses";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const { colors } = useExpenses();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    Keyboard.dismiss();
    setError(null);

    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter your username");
      return;
    }

    setSubmitting(true);
    const result = await login(trimmed);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Login failed");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const content = (
    <View style={styles.content}>
      <Image
        source={require("../../../assets/icons/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <ThemedText
        type="body"
        color="textPrimary"
        style={{
          fontFamily: Fonts.sansBold,
          fontWeight: "700",
          fontSize: 26,
          marginBottom: Spacing.xs,
        }}
      >
        Welcome Back
      </ThemedText>

      <ThemedText
        type="caption"
        color="textMuted"
        style={{ fontSize: 14, textAlign: "center" }}
      >
        To Expense Tracker
      </ThemedText>

      <ThemedText
        type="caption"
        color="textMuted"
        style={{ fontSize: 14, textAlign: "center", marginBottom: Spacing.lg }}
      >
        Enter your registered username to continue
      </ThemedText>

      <View style={styles.form}>
        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Username
        </ThemedText>

        <Input
          placeholder="e.g. Gabriel"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (error) setError(null);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!submitting}
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          style={{ marginBottom: Spacing.sm }}
        />

        {error ? (
          <ThemedText
            type="caption"
            color="danger"
            style={{ marginBottom: Spacing.sm }}
          >
            {error}
          </ThemedText>
        ) : null}

        <Button
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={colors.textOnAccent} />
          ) : (
            <ThemedText
              type="body"
              color="textOnAccent"
              style={{
                fontFamily: Fonts.sansBold,
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Sign In
            </ThemedText>
          )}
        </Button>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {Platform.OS === "web" ? (
        content
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: Spacing.lg,
  },
  form: {
    width: "100%",
  },
  btn: {
    height: 48,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
  },
});
