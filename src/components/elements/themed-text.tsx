// Pure presentational themed typography component with preset styles.
import { Fonts } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { StyleSheet, Text, type TextProps } from "react-native";

type TextType = "money" | "sectionTitle" | "body" | "caption" | "default";
type TextColor =
  | "textPrimary"
  | "textSecondary"
  | "textMuted"
  | "accent"
  | "textOnAccent"
  | "danger"
  | "warning";

export type ThemedTextProps = TextProps & {
  type?: TextType;
  color?: TextColor;
};

export default function ThemedText({
  style,
  type = "default",
  color = "textPrimary",
  ...rest
}: ThemedTextProps) {
  const { colors } = useExpenses();
  return (
    <Text
      style={[
        { color: colors[color], fontFamily: Fonts.sans },
        type === "money" && styles.money,
        type === "sectionTitle" && styles.sectionTitle,
        type === "body" && styles.body,
        type === "caption" && styles.caption,
        type === "default" && styles.body,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  money: {
    fontSize: 44,
    fontWeight: "700",
    fontFamily: Fonts.sansBold,
    fontVariant: ["tabular-nums"],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Fonts.sansSemiBold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 15,
    fontFamily: Fonts.sans,
  },
  caption: {
    fontSize: 12,
    fontFamily: Fonts.sans,
  },
});
