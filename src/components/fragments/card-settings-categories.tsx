// Fragment card for category customization list in settings.
import {
  Button,
  Card,
  ThemedText,
} from "@/components/elements";
import { Fonts, Radius, Spacing, type CategoryItem } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, StyleSheet, View } from "react-native";

export type CardSettingsCategoriesProps = {
  onAdd: () => void;
  onEdit: (item: CategoryItem) => void;
};

export default function CardSettingsCategories({
  onAdd,
  onEdit,
}: CardSettingsCategoriesProps) {
  const { colors, categories, deleteCategory } = useExpenses();

  return (
    <Card style={styles.card}>
      <View style={styles.catHeaderRow}>
        <ThemedText
          type="caption"
          color="textMuted"
          style={{ flex: 1, marginRight: Spacing.sm }}
        >
          Customize expense categories and color accents.
        </ThemedText>
        <Button
          onPress={onAdd}
          style={[styles.addCatBtn, { backgroundColor: colors.accent }]}
        >
          <ThemedText
            type="caption"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            + Add
          </ThemedText>
        </Button>
      </View>

      {categories.map((cat, idx) => (
        <View
          key={cat.id}
          style={[
            styles.catRow,
            idx < categories.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.catLeft}>
            <View
              style={[
                styles.catColorCircle,
                { backgroundColor: cat.color },
              ]}
            />
            <ThemedText
              type="body"
              color="textPrimary"
              style={{
                fontFamily: Fonts.sansSemiBold,
                fontWeight: "600",
              }}
            >
              {cat.name}
            </ThemedText>
          </View>

          <View style={styles.catActions}>
            <Pressable
              onPress={() => onEdit(cat)}
              style={[
                styles.chipBtn,
                { borderColor: colors.border, backgroundColor: "transparent" },
              ]}
              hitSlop={4}
            >
              <ThemedText
                type="caption"
                color="accent"
                style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
              >
                Edit
              </ThemedText>
            </Pressable>
            {categories.length > 1 && (
              <Pressable
                onPress={() => deleteCategory(cat.id)}
                style={[
                  styles.chipBtn,
                  { borderColor: colors.border, backgroundColor: "transparent" },
                ]}
                hitSlop={4}
              >
                <ThemedText
                  type="caption"
                  color="danger"
                  style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
                >
                  Delete
                </ThemedText>
              </Pressable>
            )}
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  catHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  addCatBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.chip,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
  catLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  catColorCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  catActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  chipBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});


