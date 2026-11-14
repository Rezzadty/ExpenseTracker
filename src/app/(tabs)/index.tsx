// Dashboard screen displaying balance summary, action buttons, category progress, and recent expenses.
import {
  AnimatedListItem,
  AnimatedScreen,
  Button,
  Chip,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import {
  CardBalance,
  CardCategoryProgress,
  CardExpenseItem,
  ModalAddExpense,
  ModalSetBudget,
  Navbar,
} from "@/components/fragments";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useDashboard } from "@/hooks/use-dashboard";
import { useExpenses } from "@/hooks/use-expenses";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, categories } = useExpenses();
  const {
    dailyBudget,
    setDailyBudget,
    addExpense,
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
    recentExpenses,
    visible,
  } = useDashboard();

  const filterOptions = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories],
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            <CardBalance todaySpent={todaySpent} dailyBudget={dailyBudget} />

            <View style={styles.actionRow}>
              <Button
                style={[styles.actionBtn, { backgroundColor: colors.accent }]}
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
              </Button>
              <Button
                style={[
                  styles.actionBtn,
                  styles.actionBtnOutline,
                  { borderColor: colors.accent },
                ]}
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
              </Button>
            </View>

            <ThemedView surface="surface" style={[styles.card, { borderColor: colors.border }]}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Outcome Analytics
              </ThemedText>
              {(Object.entries(byCategory) as [string, number][]).map(
                ([cat, amt]) => (
                  <CardCategoryProgress
                    key={cat}
                    category={cat as any}
                    amount={amt}
                    max={maxCategory}
                  />
                ),
              )}
            </ThemedView>

            <View style={styles.chipRow}>
              {filterOptions.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={filter === c}
                  onPress={() => setFilter(c as any)}
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
                  No expenses in the last 7 days
                </ThemedText>
                {filtered.length > 0 && (
                  <Pressable
                    style={[
                      styles.seeAllBtn,
                      {
                        backgroundColor: colors.surfaceRaised,
                        borderColor: colors.border,
                        borderWidth: 1,
                        marginTop: Spacing.md,
                        paddingHorizontal: Spacing.lg,
                      },
                    ]}
                    onPress={() => router.push("/(tabs)/expenses")}
                  >
                    <ThemedText
                      type="body"
                      color="accent"
                      style={{
                        fontFamily: Fonts.sansSemiBold,
                        fontWeight: "600",
                      }}
                    >
                      View All in Expenses ({filtered.length})
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            ) : (
              <>
                {visible.map((item, i) => (
                  <AnimatedListItem key={item.id} index={i}>
                    <CardExpenseItem item={item} />
                  </AnimatedListItem>
                ))}
                {recentExpenses.length > 4 && (
                  <Pressable
                    style={[
                      styles.seeAllBtn,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                      },
                    ]}
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
                      {expanded ? "Show Less" : `See All (${recentExpenses.length})`}
                    </ThemedText>
                  </Pressable>
                )}
                {filtered.length > recentExpenses.length && (
                  <Pressable
                    style={[
                      styles.seeAllBtn,
                      {
                        backgroundColor: colors.surfaceRaised,
                        borderColor: colors.border,
                        borderWidth: 1,
                        marginTop: Spacing.sm,
                      },
                    ]}
                    onPress={() => router.push("/(tabs)/expenses")}
                  >
                    <ThemedText
                      type="body"
                      color="accent"
                      style={{
                        fontFamily: Fonts.sansSemiBold,
                        fontWeight: "600",
                      }}
                    >
                      View All in Expenses ({filtered.length})
                    </ThemedText>
                  </Pressable>
                )}
              </>
            )}
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>

      <ModalAddExpense
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={addExpense}
      />
      <ModalSetBudget
        visible={showBudget}
        initialBudget={dailyBudget}
        onClose={() => setShowBudget(false)}
        onSave={setDailyBudget}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  seeAllBtn: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: Radius.listRow,
  },
});
