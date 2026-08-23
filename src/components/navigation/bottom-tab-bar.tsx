import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { Pressable, StyleSheet, View } from "react-native";

export function BottomTabBar() {
  return (
    <View style={styles.bottomTab}>
      <Pressable style={styles.tabItem}>
        <ThemedText type="caption" color="accent" style={{ fontSize: 20 }}>
          ▣
        </ThemedText>
        <ThemedText
          type="caption"
          color="accent"
          style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
        >
          Dashboard
        </ThemedText>
      </Pressable>
      <Pressable style={styles.tabItem}>
        <ThemedText type="caption" color="textMuted" style={{ fontSize: 20 }}>
          ₿
        </ThemedText>
        <ThemedText type="caption" color="textMuted">
          Expenses
        </ThemedText>
      </Pressable>
      <Pressable style={styles.tabItem}>
        <ThemedText type="caption" color="textMuted" style={{ fontSize: 20 }}>
          ◔
        </ThemedText>
        <ThemedText type="caption" color="textMuted">
          Statistics
        </ThemedText>
      </Pressable>
      <Pressable style={styles.tabItem}>
        <ThemedText type="caption" color="textMuted" style={{ fontSize: 20 }}>
          ⚙
        </ThemedText>
        <ThemedText type="caption" color="textMuted">
          Settings
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingBottom: 28,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabItem: {
    alignItems: "center",
    gap: 2,
  },
});
