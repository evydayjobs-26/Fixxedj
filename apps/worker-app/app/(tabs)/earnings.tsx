import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "@/api/client";
import { colors } from "@/theme/colors";

type Earning = {
  week: string;
  total: number;
  jobs: number;
};

export default function EarningsScreen() {
  const [summary, setSummary] = useState<{ total: number; this_week: number; pending: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: wire up a real earnings endpoint
    setTimeout(() => {
      setSummary({ total: 12400, this_week: 3200, pending: 800 });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Earnings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Earned</Text>
        <Text style={styles.bigAmount}>₹{summary?.total.toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.label}>This Week</Text>
          <Text style={styles.amount}>₹{summary?.this_week.toLocaleString()}</Text>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.label}>Pending</Text>
          <Text style={[styles.amount, { color: colors.warning }]}>₹{summary?.pending.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: colors.text },
  row: { flexDirection: "row", gap: 12 },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 20,
    marginBottom: 12, elevation: 2, flex: 1,
  },
  halfCard: { flex: 0.5 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  bigAmount: { fontSize: 32, fontWeight: "700", color: colors.primary },
  amount: { fontSize: 20, fontWeight: "700", color: colors.text },
});
