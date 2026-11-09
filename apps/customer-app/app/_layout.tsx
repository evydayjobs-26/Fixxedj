import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="service/[id]" options={{ title: "Service Detail" }} />
        <Stack.Screen name="booking/[id]" options={{ title: "Booking Detail" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
