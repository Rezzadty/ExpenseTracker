// Modal for adding new expense records with category selection.
import {
  AnimatedModal,
  Button,
  Chip,
  Input,
  ThemedText,
} from "@/components/elements";
import {
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { CURRENCY_OPTIONS, BASE_CURRENCY } from "@/utils/format";
import { validateAmount, validateNote } from "@/utils/validation";
import { convertAmount } from "@/services/exchange-rate";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

export type ModalAddExpenseProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    amount: number;
    category: Category;
    note: string;
    date: string;
  }) => void;
};

export default function ModalAddExpense({
  visible,
  onClose,
  onSave,
}: ModalAddExpenseProps) {
  const { currency, colors, categories, rates } = useExpenses();
  const symbol = CURRENCY_OPTIONS[currency]?.symbol || "Rp";

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setAmount("");
    setNote("");
    setSelectedCategory(null);
    setDate(new Date());
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const activeCategory =
    (selectedCategory && categories.some((c) => c.name === selectedCategory)
      ? selectedCategory
      : categories[0]?.name) || "Food";

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = () => {
    setError(null);
    const amountResult = validateAmount(amount);
    if (!amountResult.valid) {
      setError(amountResult.error!);
      return;
    }
    const noteResult = validateNote(note);
    if (!noteResult.valid) {
      setError(noteResult.error!);
      return;
    }

    // Convert input amount from display currency to base currency (IDR) for storage
    const amountInBase =
      currency === BASE_CURRENCY
        ? amountResult.value!
        : convertAmount(amountResult.value!, currency, BASE_CURRENCY, rates);

    onSave({
      amount: amountInBase,
      category: activeCategory,
      note: noteResult.value!,
      date: date.toISOString().slice(0, 10),
    });
    resetForm();
    onClose();
  };

  return (
    <AnimatedModal visible={visible} onClose={handleClose}>
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <ThemedText
            type="body"
            color="textPrimary"
            style={{
              fontFamily: Fonts.sansBold,
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            Add Expense
          </ThemedText>
          <Pressable
            onPress={handleClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>
              ✕
            </ThemedText>
          </Pressable>
        </View>

        {error && (
          <ThemedText
            type="caption"
            color="danger"
            style={{ marginBottom: Spacing.sm }}
          >
            {error}
          </ThemedText>
        )}

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          {`Amount (${symbol})`}
        </ThemedText>
        <Input
          placeholder="e.g. 50000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{ marginBottom: Spacing.base }}
        />

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Note
        </ThemedText>
        <Input
          placeholder="What was it for?"
          value={note}
          onChangeText={setNote}
          style={{ marginBottom: Spacing.base }}
        />

         <ThemedText
           type="caption"
           color="textSecondary"
           style={{ marginBottom: Spacing.xs }}
         >
           Date
         </ThemedText>
         <Pressable
           style={[styles.dateBtn, { backgroundColor: colors.surface }]}
           onPress={() => setShowDatePicker(true)}
         >
           <ThemedText type="body" color="textPrimary">
             {date.toDateString()}
           </ThemedText>
         </Pressable>
         {showDatePicker && (
           <DateTimePicker
             value={date}
             mode="date"
             display="default"
             onChange={onDateChange}
           />
         )}

         <ThemedText
           type="caption"
           color="textSecondary"
           style={{ marginBottom: Spacing.xs }}
         >
           Category
         </ThemedText>

        <View style={styles.chipRow}>
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={activeCategory === c.name}
              onPress={() => setSelectedCategory(c.name)}
            />
          ))}
        </View>

        <Button style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave}>
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            Save Expense
          </ThemedText>
        </Button>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  content: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  dateBtn: {
    padding: Spacing.md,
    borderRadius: Radius.button,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    marginTop: Spacing.lg,
  },
});
