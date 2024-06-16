import { ScrollView, StyleSheet, Text, View } from "react-native";
import CreateRecipeButtonAndModal from "../components/CreateRecipeButtonAndModal";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import RecipeList from "../components/RecipeList";
import IngredientList from "../components/IngredientList";
import { theme } from "../GlobalStyles";

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
    console.log("RECIPES RESULT FROM GET DATA :", result);
    const IngredientResult = await db.getAllAsync("SELECT * FROM ingredients");
    setIngredients(IngredientResult);
    console.log("ingrdients RESULT FROM GET DATA ", IngredientResult);
  }
  async function deleteRecipe(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM recipes WHERE id = ?;", [id]);
      await getData();
    });
  }
  async function createRecipe(recipe) {
    db.withTransactionAsync(async () => {
      const {
        name,
        description,
        category,
        healthyness,
        images,
        instructions,
        ingredients,
      } = recipe;
      // Simple validation example
      if (
        !name ||
        !description ||
        !category ||
        !healthyness ||
        !images ||
        !instructions ||
        !ingredients ||
        ingredients.length === 0
      ) {
        throw new Error("Missing required recipe information.");
      }
      // Insert into recipes table and get the inserted recipe's ID
      const result = await db.runAsync(
        "INSERT INTO recipes (name, description, category, healthyness, images, instructions) VALUES (?, ?, ?, ?, ?, ?);",
        [name, description, category, healthyness, images, instructions]
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

      <IngredientList ingredients={ingredients} />
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
