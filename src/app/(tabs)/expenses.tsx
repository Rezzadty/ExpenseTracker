// Expenses screen displaying full expense list with filter, search, delete, and add modal trigger.
import { AnimatedScreen, ThemedText, ThemedView } from "@/components/elements";
import {
  CardExpensesSection,
  ModalAddExpense,
  Navbar,
} from "@/components/fragments";
import { Fonts, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExpensesScreen() {
  const { expenses, addExpense, deleteExpense, colors } = useExpenses();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={{ marginBottom: Spacing.base }}
            >
              All Expenses
            </ThemedText>

            <CardExpensesSection
              expenses={expenses}
              onDelete={deleteExpense}
            />
          </ScrollView>
        </AnimatedScreen>

        <Pressable
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={() => setShowAdd(true)}
        >
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{
              fontFamily: Fonts.sansBold,
              fontWeight: "700",
              fontSize: 24,
            }}
          >
            +
          </ThemedText>
        </Pressable>
      </SafeAreaView>

      <ModalAddExpense
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addExpense}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    boxShadow: "0px 4px 12px rgba(0,217,163,0.4)",
  },
});
