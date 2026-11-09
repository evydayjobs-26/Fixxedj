import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { colors } from "@/theme/colors";

type Job = {
  id: string;
  status: string;
  address: string;
  scheduled_at: string;
  total_amount: number;
};

export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/").then(({ data }) => setJobs(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={(j) => j.id}
        ListEmptyComponent={<Text style={styles.empty}>No jobs assigned yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/job/${item.id}`)}>
            <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
            <Text style={styles.sub}>{new Date(item.scheduled_at).toLocaleString()}</Text>
            <View style={styles.row}>
              <Text style={styles.status}>{item.status.replace("_", " ").toUpperCase()}</Text>
              <Text style={styles.amount}>₹{item.total_amount}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: colors.text },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 48 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  address: { fontSize: 15, fontWeight: "600", color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  status: { fontSize: 12, color: colors.primary, fontWeight: "600" },
  amount: { fontSize: 14, fontWeight: "700", color: colors.text },
});
