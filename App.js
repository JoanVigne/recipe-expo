import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RecipeModal from "./components/RecipeModal";

export default function App() {
  return (
    <View style={styles.container}>
      <RecipeModal />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
