import { initDb } from "@/lib/database";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  const router = useRouter();

  useEffect(() => {
    initDb();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/AddBugScreen")}
      >
        <Text style={styles.buttonText}>+ Add New Bug</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  text: { color: "white", fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8 },
  buttonText: { color: "white", fontSize: 18 },
});
