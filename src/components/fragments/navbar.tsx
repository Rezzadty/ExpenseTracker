// Fragment top navigation bar displaying application title.
import { ThemedText } from "@/components/elements";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export type NavbarProps = {
  title?: string;
};

export default function Navbar({ title = "ExpenseTracker" }: NavbarProps) {
  return (
    <View style={styles.navbar}>
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
    borderBottomColor: Colors.border,
  },
});
