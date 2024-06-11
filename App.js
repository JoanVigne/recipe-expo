import * as React from "react";
import { theme } from "./GlobalStyles";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite/next";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { ActivityIndicator } from "react-native-paper";
import Home from "./screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createNativeStackNavigator();
const loadDatabase = async () => {
  const dbName = "myRecipeDB.db";
  const dbAsset = require("./assets/myRecipeDB.db");

  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState(false);
  const [dbData, setDbData] = React.useState(null);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <NavigationContainer>
      <React.Suspense
        fallback={
          <View>
            <ActivityIndicator size="large" />
            <Text>Loading...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName="myRecipeDB.db" useSuspense={true}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.dark,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              option={{ headerTitle: "recettes", headerLargeTitle: true }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
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
