// Fragment card for about and version info.
import { Button, Card, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { auth } from "@/lib/firebase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ModalConfirmLogout from "./modal-confirm-logout";

export default function CardSettingsAbout() {
  const { expenses, colors } = useExpenses();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const handleConfirmLogout = () => {
    signOut(auth)
      .then(() => router.replace("/(auth)/login"))
      .catch(() => {});
  };

  return (
    <Card style={styles.card}>
      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          App Name
        </ThemedText>
        <ThemedText type="body" color="textPrimary" style={styles.infoValue}>
          ExpenseTracker
        </ThemedText>
      </View>

      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          Version
        </ThemedText>
        <ThemedText type="body" color="textPrimary" style={styles.infoValue}>
          1.0.0 (Build 1)
        </ThemedText>
      </View>

      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <ThemedText type="caption" color="textMuted">
          Total Records
        </ThemedText>
        <ThemedText type="body" color="textPrimary" style={styles.infoValue}>
          {expenses.length} transaction
          {expenses.length !== 1 ? "s" : ""}
        </ThemedText>
      </View>

      <View style={styles.buttonRow}>
        <Button
          onPress={() =>
            handleOpenLink("https://github.com/Rezzadty/ExpenseTracker")
          }
          style={[styles.docButton, { borderColor: colors.accent }]}
        >
          <ThemedText
            type="body"
            color="accent"
            style={{
              fontFamily: Fonts.sansSemiBold,
              fontWeight: "600",
            }}
          >
            Documentation & Terms
          </ThemedText>
        </Button>
      </View>

      <View style={styles.buttonRow}>
        <Button
          onPress={() => setShowLogout(true)}
          style={[styles.docButton, { borderColor: colors.danger }]}
        >
          <ThemedText
            type="body"
            color="danger"
            style={{
              fontFamily: Fonts.sansSemiBold,
              fontWeight: "600",
            }}
          >
            Logout
          </ThemedText>
        </Button>
      </View>

      <ModalConfirmLogout
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleConfirmLogout}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  infoValue: {
    fontFamily: Fonts.sansSemiBold,
    fontWeight: "600",
  },
  buttonRow: {
    marginTop: Spacing.lg,
    flexDirection: "row",
  },
  docButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
