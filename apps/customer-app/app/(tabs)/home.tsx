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

type Service = { id: string; name: string; category: string; base_price: number; icon_url?: string };

export default function HomeScreen() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services/").then(({ data }) => setServices(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.loader} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What do you need fixed?</Text>
      <FlatList
        data={services}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/service/${item.id}`)}
          >
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardPrice}>₹{item.base_price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: colors.text },
  loader: { flex: 1 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: {
    flex: 0.48,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardName: { fontSize: 15, fontWeight: "600", color: colors.text },
  cardCategory: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  cardPrice: { fontSize: 14, fontWeight: "700", color: colors.primary, marginTop: 8 },
});
