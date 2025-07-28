import { AuthProvider, useAuth } from "@/app_context/auth_context";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function AppStack() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        console.log("User is authenticated:", user);
        setLoading(false);
      } else {
        console.log("No user authenticated:", user);
        setLoading(false);
      }
    }, 2000);
  }, [user]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="auth/auth" />
      ) : (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </>
      )}
    </Stack>
  );
}

export function LoadingComponent() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <AppStack />
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}

