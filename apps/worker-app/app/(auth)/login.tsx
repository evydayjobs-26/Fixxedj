import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { colors } from "@/theme/colors";

export default function WorkerLoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Invalid", "Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/send-otp", null, { params: { phone } });
      router.push({ pathname: "/(auth)/otp", params: { phone } });
    } catch {
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Worker Login</Text>
      <Text style={styles.subtitle}>Sign in to manage your jobs</Text>

      <TextInput
        style={styles.input}
        placeholder="+91 98765 43210"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={15}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Sending…" : "Send OTP"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "700", color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    padding: 14, fontSize: 16, marginBottom: 16, backgroundColor: "#fff",
  },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
