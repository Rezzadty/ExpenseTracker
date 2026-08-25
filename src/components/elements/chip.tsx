// Pure presentational chip/badge selector component.
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { Pressable, StyleSheet, type PressableProps } from "react-native";
import ThemedText from "./themed-text";

export type ChipProps = PressableProps & {
  label: string;
  selected?: boolean;
};

export default function Chip({ label, selected = false, style, ...rest }: ChipProps) {
  return (
    <Pressable
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
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
  chipSelected: {
    backgroundColor: Colors.accentSoft,
  },
  chipUnselected: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
