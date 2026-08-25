import { CategoryBar } from "@/components/dashboard/category-bar";
import { ExpenseRow } from "@/components/dashboard/expense-row";
import { SpendingCard } from "@/components/dashboard/spending-card";
import { AddExpenseModal } from "@/components/modals/add-expense-modal";
import { SetBudgetModal } from "@/components/modals/set-budget-modal";
import { Navbar } from "@/components/navigation/navbar";
import { AnimatedListItem } from "@/components/ui/animated-list-item";
import { AnimatedScreen } from "@/components/ui/animated-screen";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import {
  Colors,
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useDashboard } from "@/hooks/use-dashboard";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Bills",
  "Fun",
  "Other",
];

function CategoryChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
      ]}
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

export default function DashboardScreen() {
  const {
    addExpense,
    deleteExpense,
    todaySpent,
    byCategory,
    filter,
    setFilter,
    expanded,
    setExpanded,
    showAddExpense,
    setShowAddExpense,
    showBudget,
    setShowBudget,
    maxCategory,
    filtered,
    visible,
  } = useDashboard();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <SpendingCard todaySpent={todaySpent} />

          <View style={styles.actionRow}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => setShowAddExpense(true)}
            >
              <ThemedText
                type="body"
                color="textOnAccent"
                style={{ fontSize: 18, marginRight: Spacing.sm }}
              >
                +
              </ThemedText>
              <ThemedText
                type="body"
                color="textOnAccent"
                style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
              >
                Add Expense
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => setShowBudget(true)}
            >
              <ThemedText
                type="body"
                color="accent"
                style={{ fontSize: 18, marginRight: Spacing.sm }}
              >
                ⊘
              </ThemedText>
              <ThemedText
                type="body"
                color="accent"
                style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
              >
                Set Budget
              </ThemedText>
            </Pressable>
          </View>

          <ThemedView surface="surface" style={styles.card}>
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={{ marginBottom: Spacing.base }}
            >
              Outcome Analytics
            </ThemedText>
            {(Object.entries(byCategory) as [Category, number][]).map(
              ([cat, amt]) => (
                <CategoryBar
                  key={cat}
                  category={cat}
                  amount={amt}
                  max={maxCategory}
                />
              ),
            )}
          </ThemedView>

          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c}
                label={c}
                selected={filter === c}
                onPress={() => setFilter(c)}
              />
            ))}
          </View>

          <ThemedText
            type="sectionTitle"
            color="textSecondary"
            style={{ marginBottom: Spacing.md }}
          >
            Recent Expenses
          </ThemedText>

          {visible.length === 0 ? (
            <View
              style={{ paddingVertical: Spacing.xxl, alignItems: "center" }}
            >
              <ThemedText type="body" color="textMuted">
                No expenses found
              </ThemedText>
            </View>
          ) : (
            <>
              {visible.map((item, i) => (
                <AnimatedListItem key={item.id} index={i}>
                  <ExpenseRow
                    item={item}
                    onDelete={deleteExpense}
                  />
                </AnimatedListItem>
              ))}
              {filtered.length > 4 && (
                <Pressable
                  style={styles.seeAllBtn}
                  onPress={() => setExpanded((v) => !v)}
                >
                  <ThemedText
                    type="body"
                    color="accent"
                    style={{
                      fontFamily: Fonts.sansSemiBold,
                      fontWeight: "600",
                    }}
                  >
                    {expanded ? "Show Less" : `See All (${filtered.length})`}
                  </ThemedText>
                </Pressable>
              )}
            </>
          )}
        </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>

      <AddExpenseModal
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={addExpense}
      />
      <SetBudgetModal
        visible={showBudget}
        onClose={() => setShowBudget(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  listContent: { padding: Spacing.base, paddingBottom: 100 },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
  },
  chipSelected: { backgroundColor: Colors.accentSoft },
  chipUnselected: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seeAllBtn: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.listRow,
  },
});
