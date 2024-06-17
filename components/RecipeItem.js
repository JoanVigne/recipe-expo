import { useState, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { theme } from "../GlobalStyles";

export default function RecipeItem({ recipe }) {
  const [isRotated, setIsRotated] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sizeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isRotated ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sizeAnim, {
        toValue: isRotated ? 1 : 0,
        duration: 200,
        useNativeDriver: false, // height animation doesn't support native driver
      }),
    ]).start();
  }, [isRotated]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  const sizeInterpolate = sizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], // Change these values to your desired heights
  });

  const animatedStyles = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const sizeAnimatedStyles = {
    maxHeight: sizeInterpolate,
  };

  const handleRotate = () => {
    setIsRotated(!isRotated);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleRotate}>
      <View style={styles.containerText}>
        <Text style={styles.text}>{recipe.name} </Text>
        <Animated.View style={animatedStyles}>
          <Icon
            style={styles.iconArrow}
            name={"arrow-down"}
            type="font-awesome"
            color={theme.colors.primary}
          />
        </Animated.View>
      </View>
      <View style={styles.containerInstructionAndIngredients}>
        <Animated.View style={sizeAnimatedStyles}>
          <Text style={styles.text}>{recipe.instructions}</Text>
        </Animated.View>
        <Animated.View style={sizeAnimatedStyles}>
          {isRotated && (
            <View>
              <Text style={styles.text}>Ingredients:</Text>
              {Object.entries(JSON.parse(recipe.ingredients)).map(
                ([ingredient, details]) => (
                  <Text
                    key={ingredient}
                    style={styles.text}
                  >{`${ingredient}: ${details.quantity} ${details.unit}`}</Text>
                )
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    backgroundColor: theme.colors.sweet2,
    borderRadius: 5,
    flexDirection: "column",
  },
  containerText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerInstructionAndIngredients: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    maxWidth: 200,
  },
  iconArrow: {
    fontSize: 18,
  },
});
