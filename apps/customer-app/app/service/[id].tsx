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

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  duration_minutes: number;
};

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get(`/services/${id}`).then(({ data }) => setService(data)).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!service) return;
    setBooking(true);
    try {
      const { data } = await api.post("/bookings/", null, {
        params: {
          service_id: service.id,
          scheduled_at: new Date(Date.now() + 3600_000).toISOString(),
          address: "123 Main Street, City",
        },
      });
      router.push(`/booking/${data.id}`);
    } catch {
      Alert.alert("Error", "Failed to create booking.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  if (!service) return <Text style={{ padding: 24 }}>Service not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{service.name}</Text>
      <Text style={styles.category}>{service.category}</Text>
      <Text style={styles.description}>{service.description}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Base Price</Text>
        <Text style={styles.value}>₹{service.base_price}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{service.duration_minutes} min</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, booking && styles.buttonDisabled]}
        onPress={handleBook}
        disabled={booking}
      >
        <Text style={styles.buttonText}>{booking ? "Booking…" : "Book Now"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  name: { fontSize: 24, fontWeight: "700", color: colors.text },
  category: { fontSize: 14, color: colors.textMuted, marginBottom: 12 },
  description: { fontSize: 15, color: colors.text, lineHeight: 22, marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, fontWeight: "600", color: colors.text },
  button: { marginTop: 32, backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
