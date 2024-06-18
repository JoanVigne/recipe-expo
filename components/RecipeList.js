import { Button, Text, TouchableOpacity, View } from "react-native";
import RecipeItem from "./RecipeItem";

export default function RecipeList({ recipes, deleteRecipe, createRecipe }) {
  return (
    <View>
      {recipes.map((recipe, i) => {
        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onLongPress={() => console.log("long press")}
          >
            <RecipeItem recipe={recipe} deleteRecipe={deleteRecipe} />

            {/*   <Text>{recipe.name}</Text>
            <Text>{recipe.instructions}</Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
