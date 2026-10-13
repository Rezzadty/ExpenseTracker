import { Button, Card, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { StyleSheet, View } from "react-native";

export type CardSettingsLogoutProps = {
  username?: string;
  onLogout: () => void;
};

export default function CardSettingsLogout({
  username,
  onLogout,
}: CardSettingsLogoutProps) {
  const { colors } = useExpenses();

  return (
    <Card style={styles.card}>
      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          Logged in as
        </ThemedText>
        <ThemedText type="body" color="textPrimary" style={styles.infoValue}>
          {username ?? "—"}
        </ThemedText>
      </View>

      <View style={styles.buttonRow}>
        <Button
          onPress={onLogout}
          style={[styles.logoutButton, { borderColor: colors.danger }]}
        >
          <ThemedText
            type="body"
            color="danger"
            style={{
              fontFamily: Fonts.sansSemiBold,
              fontWeight: "600",
            }}
          >
            Logout
          </ThemedText>
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  infoValue: {
    fontFamily: Fonts.sansSemiBold,
    fontWeight: "600",
  },
  buttonRow: {
    marginTop: Spacing.lg,
    flexDirection: "row",
  },
  logoutButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
