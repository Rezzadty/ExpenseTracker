// Pure presentational text input component with theme styling.
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export type InputProps = TextInputProps;

export default function Input({ style, ...props }: InputProps) {
  const { colors } = useExpenses();
  return (
    <TextInput
      placeholderTextColor={colors.textMuted}
      style={[
        styles.input,
        {
          backgroundColor: colors.background,
          color: colors.textPrimary,
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
});
