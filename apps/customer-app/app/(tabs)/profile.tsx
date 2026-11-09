import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.full_name?.[0] ?? "U"}</Text>
      </View>
      <Text style={styles.name}>{user?.full_name ?? "Guest"}</Text>
      <Text style={styles.phone}>{user?.phone ?? ""}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 32, backgroundColor: colors.background },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700", color: colors.text },
  phone: { fontSize: 14, color: colors.textMuted, marginBottom: 32 },
  button: { backgroundColor: "#ef4444", padding: 14, borderRadius: 12, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
