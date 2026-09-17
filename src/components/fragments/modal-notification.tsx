import { AnimatedModal, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalNotificationProps = {
  visible: boolean;
  type?: "success" | "error" | "info";
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
};

export default function ModalNotification({
  visible,
  type = "info",
  title,
  message,
  buttonText,
  onClose,
}: ModalNotificationProps) {
  const { colors } = useExpenses();

  const buttonColor = type === "error" ? colors.danger : colors.accent;
  const defaultBtnText = buttonText ?? (type === "error" ? "Try Again" : "Continue");

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={[styles.content, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
            {title}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={12}>
            <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>
              ✕
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type="body"
          color="textSecondary"
          style={{
            fontSize: 15,
            lineHeight: 22,
            marginBottom: Spacing.xl,
          }}
        >
          {message}
        </ThemedText>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: buttonColor }]}
          onPress={onClose}
        >
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600", fontSize: 16 }}
          >
            {defaultBtnText}
          </ThemedText>
        </Pressable>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  content: {
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
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
  },
});
