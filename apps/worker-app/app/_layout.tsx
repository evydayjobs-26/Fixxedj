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
        <Stack.Screen name="job/[id]" options={{ title: "Job Detail" }} />
        <Stack.Screen name="onboarding/kyc" options={{ title: "KYC Verification" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
