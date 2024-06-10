import { Text, TouchableOpacity, View } from "react-native";

export default function RecipeList({ recipes }) {
  return (
    <View>
      {recipes.map((recipe, i) => {
        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onLongPress={() => console.log("long press")}
          >
            <Text>{recipe.name}</Text>
            <Text>{recipe.instructions}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
