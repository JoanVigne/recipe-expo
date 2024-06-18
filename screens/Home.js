import { ScrollView, StyleSheet, Text, View } from "react-native";
import CreateRecipeButtonAndModal from "../components/CreateRecipeButtonAndModal";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import RecipeList from "../components/RecipeList";
import { theme } from "../GlobalStyles";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recipeIdToDelete, setRecipeIdToDelete] = useState(null);
  function promptDeleteRecipe(id) {
    setRecipeIdToDelete(id);
    setIsModalVisible(true);
  }
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

  async function createRecipe(recipe) {
    console.log("Recipe from createRecipe:", recipe);
    try {
      await db.withTransactionAsync(async () => {
        const { name, category, instructions, ingredients } = recipe;
        if (!name) {
          throw new Error("Missing required recipe name.");
        }
        if (!instructions) {
          throw new Error("Missing required recipe instructions.");
        }
        if (!category) {
          throw new Error("Missing required recipe category.");
        }
        if (!ingredients || ingredients.length === 0) {
          throw new Error(
            "Missing required recipe ingredients or ingredients are empty."
          );
        }
        const result = await db.runAsync(
          "INSERT INTO recipes (name, instructions, category, ingredients) VALUES (?, ?, ?, ?);",
          [name, instructions, category, JSON.stringify(ingredients)]
        );
        console.log("result from createRecipe", result);
        await getData();
      });
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  }

  async function deleteRecipe(id) {
    console.log("ID from deleteRecipe:", id);
    if (recipeIdToDelete) {
      try {
        await db.withTransactionAsync(async () => {
          await db.runAsync("DELETE FROM recipes WHERE id = ?;", [
            recipeIdToDelete,
          ]);
          console.log("Recipe deleted:", recipeIdToDelete);
          await getData();
        });
      } catch (error) {
        console.error("Failed to delete recipe:", error);
      }
    }
    // Close modal and reset state
    setIsModalVisible(false);
    setRecipeIdToDelete(null);
    /*     if(recipeIdToDelte){
      
    }
    try {
      await db.withTransactionAsync(async () => {
        const result = await db.runAsync("DELETE FROM recipes WHERE id = ?;", [
          id,
        ]);
        console.log("Delete result:", result);
        await getData();
      });
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      throw error;
    } */
  }

  return (
    <ScrollView style={styles.container}>
      <CreateRecipeButtonAndModal createRecipe={createRecipe} />
      <Text style={styles.title}> All the recipes </Text>
      <RecipeList recipes={recipes} deleteRecipe={promptDeleteRecipe} />
      <DeleteConfirmModal
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onDelete={deleteRecipe}
      />
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
