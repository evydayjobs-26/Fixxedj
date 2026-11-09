import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { colors } from "@/theme/colors";

type UploadedDoc = { name: string; uri: string };

export default function KycScreen() {
  const router = useRouter();
  const [idDoc, setIdDoc] = useState<UploadedDoc | null>(null);
  const [selfie, setSelfie] = useState<UploadedDoc | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickDocument = async (type: "id" | "selfie") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const doc = { name: result.assets[0].name, uri: result.assets[0].uri };
    if (type === "id") setIdDoc(doc);
    else setSelfie(doc);
  };

  const handleSubmit = async () => {
    if (!idDoc || !selfie) {
      Alert.alert("Missing Documents", "Please upload both ID and selfie.");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: upload documents to backend
      await new Promise((r) => setTimeout(r, 1000)); // mock
      Alert.alert("Submitted", "Your KYC documents have been submitted for review.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/jobs") },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>KYC Verification</Text>
      <Text style={styles.subtitle}>
        Upload a government-issued ID and a selfie to verify your identity.
      </Text>

      <Text style={styles.sectionLabel}>Government ID</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickDocument("id")}>
        {idDoc ? (
          <Text style={styles.uploadedText}>✓ {idDoc.name}</Text>
        ) : (
          <Text style={styles.uploadPlaceholder}>Tap to upload Aadhaar / PAN / Passport</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Selfie with ID</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickDocument("selfie")}>
        {selfie ? (
          <Text style={styles.uploadedText}>✓ {selfie.name}</Text>
        ) : (
          <Text style={styles.uploadPlaceholder}>Tap to upload selfie</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit for Review</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 24, lineHeight: 20 },
  sectionLabel: { fontSize: 15, fontWeight: "600", color: colors.text, marginBottom: 8 },
  uploadBox: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  uploadPlaceholder: { color: colors.textMuted, fontSize: 14 },
  uploadedText: { color: colors.success, fontWeight: "600", fontSize: 14 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
