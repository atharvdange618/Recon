import { initDb } from "@/lib/database";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    initDb();
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#121212" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
    </Stack>
  );
}
