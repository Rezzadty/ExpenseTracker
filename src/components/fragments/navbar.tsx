// Fragment top navigation bar displaying application title.
import { ThemedText } from "@/components/elements";
import { Fonts, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { StyleSheet, View } from "react-native";

export type NavbarProps = {
  title?: string;
};

export default function Navbar({ title = "ExpenseTracker" }: NavbarProps) {
  const { colors } = useExpenses();
  return (
    <View style={[styles.navbar, { borderBottomColor: colors.border }]}>
      <ThemedText
        type="body"
        color="textPrimary"
        style={{
          fontFamily: Fonts.sansSemiBold,
          fontWeight: "600",
          fontSize: 17,
        }}
      >
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
});
