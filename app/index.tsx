import { initDb } from "@/lib/database";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome to Recon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
