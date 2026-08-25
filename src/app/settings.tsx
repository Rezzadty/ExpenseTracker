// Settings screen placeholder view.
import { AnimatedScreen, ThemedText, ThemedView } from "@/components/elements";
import { Navbar } from "@/components/fragments";
import { Colors, Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ThemedView style={styles.center}>
            <ThemedText type="body" color="textMuted">
              Coming soon
            </ThemedText>
          </ThemedView>
        </AnimatedScreen>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.base,
  },
});
