import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/api/client";
import { colors } from "@/theme/colors";

type Booking = {
  id: string;
  status: string;
  address: string;
  scheduled_at: string;
  total_amount: number;
  notes?: string;
};

const STEPS = ["pending", "accepted", "en_route", "in_progress", "completed"];

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(({ data }) => setBooking(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  if (!booking) return <Text style={{ padding: 24 }}>Booking not found.</Text>;

  const stepIndex = STEPS.indexOf(booking.status);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.id}>#{booking.id.slice(0, 8).toUpperCase()}</Text>
      <Text style={styles.address}>{booking.address}</Text>
      <Text style={styles.sub}>{new Date(booking.scheduled_at).toLocaleString()}</Text>

      {/* Status tracker */}
      <View style={styles.tracker}>
        {STEPS.map((step, i) => (
          <View key={step} style={styles.stepRow}>
            <View style={[styles.dot, i <= stepIndex ? styles.dotActive : styles.dotInactive]} />
            <Text style={[styles.stepLabel, i <= stepIndex ? styles.labelActive : styles.labelInactive]}>
              {step.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>₹{booking.total_amount}</Text>
      </View>
      {booking.notes && (
        <View style={styles.notes}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.notesText}>{booking.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  id: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  address: { fontSize: 20, fontWeight: "700", color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginBottom: 24 },
  tracker: { marginBottom: 24 },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  dotActive: { backgroundColor: colors.primary },
  dotInactive: { backgroundColor: colors.border },
  stepLabel: { fontSize: 13, fontWeight: "600" },
  labelActive: { color: colors.primary },
  labelInactive: { color: colors.textMuted },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, fontWeight: "600", color: colors.text },
  notes: { marginTop: 16 },
  notesText: { fontSize: 14, color: colors.text, marginTop: 4 },
});
