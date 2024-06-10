import { ScrollView, Text, View } from "react-native";
import CreateRecipeButtonAndModal from "../components/CreateRecipeButtonAndModal";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import RecipeList from "../components/RecipeList";

export default function Home() {
  console.log("test test");
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const db = useSQLiteContext();
  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync("SELECT * FROM recipes");
    console.log(result);
    setRecipes(result);
  }

  return (
    <ScrollView>
      <Text> Home </Text>
      <RecipeList recipes={recipes} />
      <CreateRecipeButtonAndModal />
    </ScrollView>
  );
}
