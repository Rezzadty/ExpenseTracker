// Fragment analytics donut chart and legend breakdown for category spending.
import { ThemedText } from "@/components/elements";
import {
  DEFAULT_CATEGORY_COLORS,
  Fonts,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

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
  const { formatAmount, colors, categoryColorMap } = useExpenses();
  const size = 200;
  const stroke = 20;
  const center = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const getCatColor = (cat: string) =>
    categoryColorMap[cat] || DEFAULT_CATEGORY_COLORS[cat] || colors.accent;

  const segments = useMemo(() => {
    return data.reduce<
      (DonutSlice & { strokeLength: number; offset: number })[]
    >((acc, slice) => {
      const prevEnd =
        acc.length > 0
          ? acc[acc.length - 1].offset + acc[acc.length - 1].strokeLength
          : 0;
      const strokeLength =
        total > 0 ? (slice.amount / total) * circumference : 0;
      return [...acc, { ...slice, strokeLength, offset: prevEnd }];
    }, []);
  }, [data, circumference, total]);

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <View
          style={{
            width: size,
            height: size,
            transform: [{ rotate: "-90deg" }],
          }}
        >
          <Svg width={size} height={size}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.track}
              strokeWidth={stroke}
              fill="none"
            />
            {segments.map((seg) => (
              <Circle
                key={seg.category}
                cx={center}
                cy={center}
                r={radius}
                stroke={getCatColor(seg.category)}
                strokeWidth={stroke}
                strokeDasharray={`${seg.strokeLength} ${circumference}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="butt"
                fill="none"
              />
            ))}
          </Svg>
        </View>

        <View style={[StyleSheet.absoluteFill, styles.centerLabel]}>
          <ThemedText
            type="caption"
            color="textSecondary"
            style={{ marginBottom: Spacing.xs }}
          >
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
            {formatAmount(total)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.legend}>
        {data.map((slice) => (
          <View key={slice.category} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: getCatColor(slice.category) },
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
              style={{
                fontFamily: Fonts.sansSemiBold,
                fontWeight: "600",
                minWidth: 40,
                textAlign: "right",
              }}
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
  container: { alignItems: "center", gap: Spacing.xl },
  centerLabel: { justifyContent: "center", alignItems: "center" },
  legend: { width: "100%", gap: Spacing.base },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
});
