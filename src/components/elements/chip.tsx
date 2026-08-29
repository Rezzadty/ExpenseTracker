// Pure presentational chip/badge selector component.
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, StyleSheet, type PressableProps } from "react-native";
import ThemedText from "./themed-text";

export type ChipProps = PressableProps & {
  label: string;
  selected?: boolean;
};

export default function Chip({ label, selected = false, style, ...rest }: ChipProps) {
  const { colors } = useExpenses();

  return (
    <Pressable
      style={[
        styles.chip,
        selected
          ? { backgroundColor: colors.accentSoft, borderColor: "transparent" }
          : { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border },
        typeof style === "function" ? undefined : style,
      ]}
      {...rest}
    >
      <ThemedText
        type="caption"
        color={selected ? "accent" : "textSecondary"}
        style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
  },
});
