import { ExpenseSection } from "@/components/expenses/expense-section";
import { AddExpenseModal } from "@/components/modals/add-expense-modal";
import { Navbar } from "@/components/navigation/navbar";
import { AnimatedScreen } from "@/components/ui/animated-screen";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExpensesScreen() {
  const { expenses, addExpense, deleteExpense } = useExpenses();
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

            <ExpenseSection expenses={expenses} onDelete={deleteExpense} />
          </ScrollView>
        </AnimatedScreen>

        <Pressable style={styles.fab} onPress={() => setShowAdd(true)}>
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansBold, fontWeight: "700", fontSize: 24 }}
          >
            +
          </ThemedText>
        </Pressable>
      </SafeAreaView>

      <AddExpenseModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addExpense}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    boxShadow: "0px 4px 12px rgba(0,217,163,0.4)",
  },
});
