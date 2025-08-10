import { initDb } from "@/lib/database";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  useEffect(() => {
    initDb();
  }, []);
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
