import { AnimatedModal, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ModalConfirmLogout({ visible, onCancel, onConfirm }: Props) {
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
          Log Out
        </ThemedText>

        <ThemedText
          type="body"
          color="textSecondary"
          style={{ fontSize: 14, lineHeight: 20, marginBottom: Spacing.xl }}
        >
          Are you sure you want to log out? You will need to sign in again to access your account.
        </ThemedText>

        <View style={styles.actionRow}>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <ThemedText
              type="body"
              color="textSecondary"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              No
            </ThemedText>
          </Pressable>
          <Pressable style={[styles.confirmBtn, { backgroundColor: colors.danger }]} onPress={onConfirm}>
            <ThemedText
              type="body"
              color="textOnAccent"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Yes, Log Out
            </ThemedText>
          </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
});
