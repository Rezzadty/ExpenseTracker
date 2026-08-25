// Fragment analytics donut chart and legend breakdown for category spending.
import { ThemedText } from "@/components/elements";
import {
  CategoryColors,
  Colors,
  Fonts,
  Spacing,
  type Category,
} from "@/constants/theme";
import { formatMoney } from "@/utils/format";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export type DonutSlice = {
  category: Category;
  amount: number;
  pct: number;
};

export type CardAnalyticsDonutProps = {
  data: DonutSlice[];
  total: number;
};

export default function CardAnalyticsDonut({
  data,
  total,
}: CardAnalyticsDonutProps) {
  const size = 200;
  const stroke = 20;

  const segments = useMemo(() => {
    return data.reduce<(DonutSlice & { startAngle: number })[]>((acc, slice) => {
      const prevEnd =
        acc.length > 0
          ? acc[acc.length - 1].startAngle + acc[acc.length - 1].pct * 3.6
          : 0;
      return [...acc, { ...slice, startAngle: prevEnd }];
    }, []);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: stroke,
              borderColor: Colors.track,
            },
          ]}
        />
        {segments.map((seg) => (
          <View
            key={seg.category}
            style={[
              StyleSheet.absoluteFill,
              { transform: [{ rotate: `${seg.startAngle - 90}deg` }] },
            ]}
          >
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: stroke,
                borderColor: "transparent",
                borderTopColor: CategoryColors[seg.category],
                borderRightColor:
                  seg.pct > 25 ? CategoryColors[seg.category] : "transparent",
                borderBottomColor:
                  seg.pct > 50 ? CategoryColors[seg.category] : "transparent",
                borderLeftColor:
                  seg.pct > 75 ? CategoryColors[seg.category] : "transparent",
              }}
            />
          </View>
        ))}
        <View style={[StyleSheet.absoluteFill, styles.centerLabel]}>
          <ThemedText type="caption" color="textSecondary">
            Total
          </ThemedText>
          <ThemedText
            type="body"
            color="textPrimary"
            style={{
              fontFamily: Fonts.sansBold,
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            {formatMoney(total)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.legend}>
        {data.map((slice) => (
          <View key={slice.category} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: CategoryColors[slice.category] },
              ]}
            />
            <ThemedText
              type="caption"
              color="textSecondary"
              style={{ flex: 1 }}
            >
              {slice.category}
            </ThemedText>
            <ThemedText
              type="caption"
              color="textPrimary"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              {slice.pct.toFixed(0)}%
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: Spacing.lg },
  ring: { position: "absolute" },
  centerLabel: { justifyContent: "center", alignItems: "center" },
  legend: { width: "100%", gap: Spacing.sm },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
});
