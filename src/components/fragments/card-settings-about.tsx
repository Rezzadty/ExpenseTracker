// Fragment card for about and version info.
import { Button, Card, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import * as Linking from "expo-linking";
import { StyleSheet, View } from "react-native";

export default function CardSettingsAbout() {
  const { expenses, colors } = useExpenses();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Card style={styles.card}>
      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          App Name
        </ThemedText>
        <ThemedText
          type="body"
          color="textPrimary"
          style={styles.infoValue}
        >
          ExpenseTracker
        </ThemedText>
      </View>

      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          Version
        </ThemedText>
        <ThemedText
          type="body"
          color="textPrimary"
          style={styles.infoValue}
        >
          1.0.0 (Build 1)
        </ThemedText>
      </View>

      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          Total Records
        </ThemedText>
        <ThemedText
          type="body"
          color="textPrimary"
          style={styles.infoValue}
        >
          {expenses.length} transaction
          {expenses.length !== 1 ? "s" : ""}
        </ThemedText>
      </View>

      <View style={styles.buttonRow}>
        <Button
          onPress={() => handleOpenLink("https://github.com")}
          style={[styles.docButton, { borderColor: colors.accent }]}
        >
          <ThemedText
            type="body"
            color="accent"
            style={{
              fontFamily: Fonts.sansSemiBold,
              fontWeight: "600",
            }}
          >
            Documentation & Terms
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
  docButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
