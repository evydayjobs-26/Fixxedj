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

type Booking = {
  id: string;
  status: string;
  scheduled_at: string;
  address: string;
  total_amount: number;
};

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b",
  accepted: "#3b82f6",
  en_route: "#6366f1",
  in_progress: "#10b981",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/").then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/booking/${item.id}`)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLOR[item.status] || "#888" }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.sub}>{new Date(item.scheduled_at).toLocaleString()}</Text>
            <Text style={styles.amount}>₹{item.total_amount}</Text>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  address: { fontSize: 15, fontWeight: "600", color: colors.text, flex: 1, marginRight: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  amount: { fontSize: 14, fontWeight: "700", color: colors.primary, marginTop: 6 },
});
