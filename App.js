import * as React from "react";
import { theme } from "./GlobalStyles";
import { SQLiteProvider } from "expo-sqlite/next";
import { StyleSheet, Text, View } from "react-native";

import { ActivityIndicator } from "react-native-paper";
import Home from "./screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import loadDatabase from "./utils/loadDatabase";
const Stack = createNativeStackNavigator();

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState(false);

  React.useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await loadDatabase();
        setDbLoaded(true);
      } catch (e) {
        console.error(e);
      }
    };

    initializeDatabase();
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
