// Fragment modal dialog for adding or editing custom categories.
import {
  AnimatedModal,
  Input,
  ThemedText,
} from "@/components/elements";
import { Fonts, Radius, Spacing, type CategoryItem } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export const PRESET_COLORS = [
  "#FFB454",
  "#5AB8FF",
  "#FF7AC3",
  "#4ADE80",
  "#B197FC",
  "#FF8A7A",
  "#00D9A3",
  "#FBBF24",
  "#F43F5E",
  "#9AA6A1",
];

export type ModalEditCategoryProps = {
  visible: boolean;
  editingItem: CategoryItem | null;
  onClose: () => void;
  onSave: (data: { name: string; color: string }) => void;
};

export default function ModalEditCategory({
  visible,
  editingItem,
  onClose,
  onSave,
}: ModalEditCategoryProps) {
  const { colors } = useExpenses();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [prevEditingItem, setPrevEditingItem] = useState<CategoryItem | null>(null);
  const [prevVisible, setPrevVisible] = useState(false);

  if (visible !== prevVisible || editingItem !== prevEditingItem) {
    setPrevVisible(visible);
    setPrevEditingItem(editingItem);
    if (editingItem) {
      setName(editingItem.name);
      setColor(editingItem.color);
    } else {
      setName("");
      setColor(PRESET_COLORS[0]);
    }
  }

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, color });
    onClose();
  };

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
        <View style={styles.modalHeader}>
          <ThemedText
            type="body"
            color="textPrimary"
            style={{
              fontFamily: Fonts.sansBold,
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            {editingItem ? "Edit Category" : "Add Category"}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={12}>
            <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>
              ✕
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Category Name
        </ThemedText>
        <Input
          placeholder="e.g. Subscriptions"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: Spacing.base }}
        />

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Color Accent
        </ThemedText>
        <View style={styles.colorPalette}>
          {PRESET_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.colorPick,
                { backgroundColor: c },
                color === c && styles.colorPickSelected,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={[styles.saveCatBtn, { backgroundColor: colors.accent }]}
          onPress={handleSave}
        >
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            Save Category
          </ThemedText>
        </Pressable>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  colorPick: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorPickSelected: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveCatBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    marginTop: Spacing.sm,
  },
});
