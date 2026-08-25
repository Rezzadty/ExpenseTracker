// Fragment modal dialog for confirming item deletion with custom dark theme styling.
import { AnimatedModal, ThemedText } from "@/components/elements";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalConfirmDeleteProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ModalConfirmDelete({
  visible,
  title = "Delete Expense",
  message = "Are you sure you want to delete this expense?",
  onCancel,
  onConfirm,
}: ModalConfirmDeleteProps) {
  return (
    <AnimatedModal visible={visible} onClose={onCancel}>
      <View style={styles.card}>
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
          {title}
        </ThemedText>

        <ThemedText
          type="body"
          color="textSecondary"
          style={{ fontSize: 14, lineHeight: 20, marginBottom: Spacing.xl }}
        >
          {message}
        </ThemedText>

        <View style={styles.actionRow}>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <ThemedText
              type="body"
              color="textSecondary"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Cancel
            </ThemedText>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={onConfirm}>
            <ThemedText
              type="body"
              color="textOnAccent"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Delete
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
  deleteBtn: {
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
});
