import { Tabs } from "expo-router";
import { colors } from "@/theme/colors";

export default function WorkerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor: colors.border },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: () => null }} />
      <Tabs.Screen name="earnings" options={{ title: "Earnings", tabBarIcon: () => null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: () => null }} />
    </Tabs>
  );
}
