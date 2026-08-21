import { Image, Pressable, StyleSheet, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const icons = {
  dashboard: require('@/assets/icons/dasboard_icon.png'),
  expenses: require('@/assets/icons/expense_icon.png'),
  statistics: require('@/assets/icons/statistics_icon.png'),
  settings: require('@/assets/icons/settings_icon.png'),
};

const tabs = [
  { key: '/', icon: icons.dashboard, label: 'Dashboard' },
  { key: '/expenses', icon: icons.expenses, label: 'Expenses' },
  { key: '/statistics', icon: icons.statistics, label: 'Statistics' },
  { key: '/settings', icon: icons.settings, label: 'Settings' },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.bottomTab}>
      {tabs.map((tab) => {
        const active = pathname === tab.key;
        return (
          <Pressable key={tab.key} style={styles.tabItem} onPress={() => router.push(tab.key as any)}>
            <Image source={tab.icon} style={styles.icon} resizeMode="contain" tintColor={active ? Colors.accent : Colors.textMuted} />
            <ThemedText
              type="caption"
              color={active ? 'accent' : 'textMuted'}
              style={active ? { fontFamily: Fonts.sansSemiBold, fontWeight: '600' } : undefined}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingBottom: 28,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabItem: {
    alignItems: 'center',
    gap: 2,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
