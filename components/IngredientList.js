import { Text, TouchableOpacity, View } from "react-native";

export default function IngredientList({ ingredients }) {
  console.log("ingredients in ingredientList", ingredients);
  return (
    <View>
      {ingredients.map((ingr, i) => {
        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onLongPress={() => console.log("long press")}
          >
            <Text>
              {ingr.ingredient}: {ingr.quantity}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
