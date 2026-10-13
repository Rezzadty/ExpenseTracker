import { AnimatedModal, Button, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { StyleSheet, View } from "react-native";

export type ModalLogoutProps = {
  visible: boolean;
  username?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ModalLogout({
  visible,
  username,
  onCancel,
  onConfirm,
}: ModalLogoutProps) {
  const { colors } = useExpenses();

  return (
    <AnimatedModal visible={visible} onClose={onCancel}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText
          type="body"
          color="textPrimary"
          style={{
            fontFamily: Fonts.sansBold,
            fontWeight: "700",
            fontSize: 18,
            marginBottom: Spacing.sm,
          }}
        >
          Logout
        </ThemedText>

        <ThemedText
          type="body"
          color="textSecondary"
          style={{ fontSize: 14, lineHeight: 20, marginBottom: Spacing.xl }}
        >
          {username ? `Logout as ${username}?` : "Are you sure you want to logout?"}
        </ThemedText>

        <View style={styles.actionRow}>
          <Button style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onCancel}>
            <ThemedText
              type="body"
              color="textSecondary"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Cancel
            </ThemedText>
          </Button>
          <Button style={[styles.logoutBtn, { backgroundColor: colors.danger }]} onPress={onConfirm}>
            <ThemedText
              type="body"
              color="textOnAccent"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Logout
            </ThemedText>
          </Button>
        </View>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
  },
  cancelBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.button,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  logoutBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.button,
  },
});
