// Settings screen providing preferences, appearance & notifications, category customization, and about / version info.
import {
  AnimatedScreen,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import {
  CardSettingsAbout,
  CardSettingsAppearance,
  CardSettingsCategories,
  CardSettingsCurrency,
  ModalEditCategory,
  Navbar,
} from "@/components/fragments";
import { Spacing, type CategoryItem } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { addCategory, updateCategory } = useExpenses();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);

  const openAddCategory = () => {
    setEditingCat(null);
    setModalVisible(true);
  };

  const openEditCategory = (item: CategoryItem) => {
    setEditingCat(item);
    setModalVisible(true);
  };

  const handleSaveCategory = ({ name, color }: { name: string; color: string }) => {
    if (editingCat) {
      updateCategory(editingCat.id, { name, color });
    } else {
      addCategory({ name, color });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar title="Settings" />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              Currency & Locale
            </ThemedText>
            <CardSettingsCurrency />

            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              Appearance & Notifications
            </ThemedText>
            <CardSettingsAppearance />

            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              Category Customization
            </ThemedText>
            <CardSettingsCategories
              onAdd={openAddCategory}
              onEdit={openEditCategory}
            />

            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              About & Version
            </ThemedText>
            <CardSettingsAbout />
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>

      <ModalEditCategory
        visible={modalVisible}
        editingItem={editingCat}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveCategory}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  sectionHeader: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
});
