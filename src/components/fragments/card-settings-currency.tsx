// Fragment card for currency and separator settings.
import { Card, Chip, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { type CurrencyCode, type SeparatorStyle } from "@/utils/format";
import { StyleSheet, View } from "react-native";

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

export default function CardSettingsCurrency() {
  const {
    currency,
    setCurrency,
    separatorStyle,
    setSeparatorStyle,
    formatAmount,
    rates,
    isRatesLive,
    colors,
  } = useExpenses();

  return (
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

      <View style={[styles.previewBox, { borderTopColor: colors.border }]}>
        <View>
          <ThemedText type="caption" color="textSecondary">
            Preview (250k IDR):
          </ThemedText>
          <ThemedText type="caption" color="textMuted">
            {isRatesLive ? "Rates: Live API" : "Rates: Default/Cached"}
          </ThemedText>
        </View>
        <ThemedText
          type="body"
          color="accent"
          style={{ fontFamily: Fonts.sansBold, fontWeight: "700" }}
        >
          {formatAmount(
            currency === "IDR"
              ? 250000
              : (250000 / rates.IDR) * rates[currency],
          )}
        </ThemedText>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
