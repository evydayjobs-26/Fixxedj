import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/api/client";
import { colors } from "@/theme/colors";

type Job = {
  id: string;
  status: string;
  address: string;
  scheduled_at: string;
  total_amount: number;
  notes?: string;
};

const NEXT_STATUS: Record<string, string> = {
  accepted: "en_route",
  en_route: "in_progress",
  in_progress: "completed",
};

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const refresh = () =>
    api.get(`/bookings/${id}`).then(({ data }) => setJob(data));

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    setUpdating(true);
    try {
      await api.patch(`/bookings/${id}/status`, null, { params: { new_status: "accepted" } });
      await refresh();
    } catch {
      Alert.alert("Error", "Could not accept job.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAdvance = async () => {
    if (!job) return;
    const next = NEXT_STATUS[job.status];
    if (!next) return;
    setUpdating(true);
    try {
      await api.patch(`/bookings/${id}/status`, null, { params: { new_status: next } });
      await refresh();
    } catch {
      Alert.alert("Error", "Could not update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  if (!job) return <Text style={{ padding: 24 }}>Job not found.</Text>;

  const canAdvance = !!NEXT_STATUS[job.status];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.id}>Job #{job.id.slice(0, 8).toUpperCase()}</Text>
      <Text style={styles.address}>{job.address}</Text>
      <Text style={styles.sub}>{new Date(job.scheduled_at).toLocaleString()}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{job.status.replace("_", " ").toUpperCase()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Payout</Text>
        <Text style={styles.value}>₹{job.total_amount}</Text>
      </View>

      {job.status === "pending" && (
        <TouchableOpacity style={styles.button} onPress={handleAccept} disabled={updating}>
          <Text style={styles.buttonText}>Accept Job</Text>
        </TouchableOpacity>
      )}
      {canAdvance && (
        <TouchableOpacity style={styles.button} onPress={handleAdvance} disabled={updating}>
          <Text style={styles.buttonText}>
            {updating ? "Updating…" : `Mark as ${NEXT_STATUS[job.status]?.replace("_", " ")}`}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  id: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  address: { fontSize: 20, fontWeight: "700", color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, fontWeight: "600", color: colors.text },
  button: { marginTop: 24, backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
