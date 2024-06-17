import { ScrollView, StyleSheet, Text, View } from "react-native";
import CreateRecipeButtonAndModal from "../components/CreateRecipeButtonAndModal";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import RecipeList from "../components/RecipeList";
import { theme } from "../GlobalStyles";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const db = useSQLiteContext();
  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    console.log("==============================");
    const result = await db.getAllAsync("SELECT * FROM recipes");
    setRecipes(result);
    console.log("RECIPES RESULT FROM GET DATA :", result);
  }
  async function deleteRecipe(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM recipes WHERE id = ?;", [id]);
      await getData();
    });
  }
  async function createRecipe(recipe) {
    console.log("recipe from createRecipe", recipe);
    return;
    db.withTransactionAsync(async () => {
      const { name, description, category, instructions, ingredients } = recipe;
      // Simple validation example
      if (
        !name ||
        !description ||
        !category ||
        !instructions ||
        ingredients.length === 0
      ) {
        throw new Error("Missing required recipe information.");
      }
      // Insert into recipes table and get the inserted recipe's ID
      const result = await db.runAsync(
        "INSERT INTO recipes (name, description, category, instructions) VALUES (?, ?, ?, ?);",
        [name, description, category, instructions]
      );
      const recipeId = result.insertId; // Assuming this is how you get the newly inserted ID, adjust based on your DB API

      // Insert each ingredient for the new recipe
      for (const ingredient of ingredients) {
        const { ingredient: ingredientName, quantity, unit } = ingredient;
        await db.runAsync(
          "INSERT INTO ingredients (ingredient, quantity, unit, recipe_id) VALUES (?, ?, ?, ?);",
          [ingredientName, quantity, unit, recipeId]
        );
      }

      // Refresh data to reflect the new recipe and its ingredients
      await getData();
    });
  }
  return (
    <ScrollView style={styles.container}>
      <CreateRecipeButtonAndModal createRecipe={createRecipe} />
      <Text style={styles.title}> All the recipes </Text>
      <RecipeList recipes={recipes} deleteRecipe={deleteRecipe} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    textAlign: "center",
  },
});
