import { initDb } from "@/lib/database";
import { initializeNotifications } from "@/lib/notifications";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "@/lib/theme";

export default function Layout() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDb();
        await initializeNotifications();
        setIsDbInitialized(true);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsDbInitialized(true);
      }
    };
    initialize();
  }, []);

  if (!isDbInitialized) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View 
          style={{ 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center", 
            backgroundColor: COLORS.background 
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#121212" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="add" />
        <Stack.Screen name="edit/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
