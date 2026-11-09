import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme/colors";

export default function WorkerOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid", "Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", null, {
        params: { phone, otp },
      });
      setAuth(data.access_token, data.refresh_token);
      router.replace("/(tabs)/jobs");
    } catch {
      Alert.alert("Error", "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Sent to {phone}</Text>
      <TextInput
        style={styles.input}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Verifying…" : "Verify"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
  title: { fontSize: 26, fontWeight: "700", color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    padding: 14, fontSize: 22, letterSpacing: 8, textAlign: "center",
    marginBottom: 16, backgroundColor: "#fff",
  },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
