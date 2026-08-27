// Settings screen providing currency & locale preferences and about / version information.
import {
  AnimatedScreen,
  Button,
  Card,
  Chip,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import { Navbar } from "@/components/fragments";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import {
  type CurrencyCode,
  type SeparatorStyle,
} from "@/utils/format";
import * as Linking from "expo-linking";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CURRENCIES: { label: string; value: CurrencyCode }[] = [
  { label: "IDR (Rp)", value: "IDR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "JPY (¥)", value: "JPY" },
];

const SEPARATORS: { label: string; value: SeparatorStyle }[] = [
  { label: "100.000 (Dot)", value: "dot" },
  { label: "100,000 (Comma)", value: "comma" },
];

export default function SettingsScreen() {
  const {
    currency,
    setCurrency,
    separatorStyle,
    setSeparatorStyle,
    expenses,
    formatAmount,
  } = useExpenses();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar title="Settings" />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Currency & Locale Section */}
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              Currency & Locale
            </ThemedText>

            <Card style={styles.card}>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginBottom: Spacing.xs }}
              >
                Select Currency
              </ThemedText>
              <View style={styles.chipRow}>
                {CURRENCIES.map((c) => (
                  <Chip
                    key={c.value}
                    label={c.label}
                    selected={currency === c.value}
                    onPress={() => setCurrency(c.value)}
                  />
                ))}
              </View>

              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginTop: Spacing.md, marginBottom: Spacing.xs }}
              >
                Number Format Separator
              </ThemedText>
              <View style={styles.chipRow}>
                {SEPARATORS.map((s) => (
                  <Chip
                    key={s.value}
                    label={s.label}
                    selected={separatorStyle === s.value}
                    onPress={() => setSeparatorStyle(s.value)}
                  />
                ))}
              </View>

              <View style={styles.previewBox}>
                <ThemedText type="caption" color="textSecondary">
                  Preview:
                </ThemedText>
                <ThemedText
                  type="body"
                  color="accent"
                  style={{ fontFamily: Fonts.sansBold, fontWeight: "700" }}
                >
                  {formatAmount(250000)}
                </ThemedText>
              </View>
            </Card>

            {/* About & Version Section */}
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              About & Version
            </ThemedText>

            <Card style={styles.card}>
              <View style={styles.infoRow}>
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

              <View style={styles.infoRow}>
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

              <View style={styles.infoRow}>
                <ThemedText type="caption" color="textMuted">
                  Total Records
                </ThemedText>
                <ThemedText
                  type="body"
                  color="textPrimary"
                  style={styles.infoValue}
                >
                  {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
                </ThemedText>
              </View>

              <View style={styles.buttonRow}>
                <Button
                  onPress={() => handleOpenLink("https://github.com")}
                  style={styles.docButton}
                >
                  <ThemedText
                    type="body"
                    color="accent"
                    style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
                  >
                    Documentation & Terms
                  </ThemedText>
                </Button>
              </View>
            </Card>
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  sectionHeader: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  previewBox: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});


