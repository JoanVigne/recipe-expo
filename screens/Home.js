import { ScrollView, Text, View } from "react-native";
import CreateRecipeButtonAndModal from "../components/CreateRecipeButtonAndModal";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import RecipeList from "../components/RecipeList";
import IngredientList from "../components/IngredientList";

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
    setRecipes(result);
    console.log(result);
    const IngredientResult = await db.getAllAsync("SELECT * FROM ingredients");
    setIngredients(IngredientResult);
    console.log(IngredientResult);
  }
  async function deleteRecipe(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM recipes WHERE id = ?;", [id]);
      await getData();
    });
  }
  return (
    <ScrollView>
      <Text> Home </Text>
      <RecipeList recipes={recipes} deleteRecipe={deleteRecipe} />
      <CreateRecipeButtonAndModal />
      <IngredientList ingredients={ingredients} />
    </ScrollView>
  );
}
