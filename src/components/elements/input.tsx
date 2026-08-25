// Pure presentational text input component with theme styling.
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export type InputProps = TextInputProps;

export default function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      placeholderTextColor={Colors.textMuted}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
