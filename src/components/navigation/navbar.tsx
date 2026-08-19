import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function Navbar() {
  return (
    <View style={styles.navbar}>
      <ThemedText
        type="body"
        color="textPrimary"
        style={{ fontFamily: Fonts.sansSemiBold, fontWeight: '600', fontSize: 17 }}
      >
        ExpenseTracker
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
});
