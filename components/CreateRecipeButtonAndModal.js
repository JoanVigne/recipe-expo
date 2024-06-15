import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ScrollView,
} from "react-native";
import { Rating } from "react-native-ratings"; // You need to install react-native-ratings for the stars
import { RadioButton } from "react-native-paper";
export default function RecipeModal({ createRecipe }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeCategory, setRecipeCategory] = useState(null);
  const [recipeGrade, setRecipeGrade] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [secretPassword, setSecretPassword] = useState("");
  const categories = [
    { label: "Dessert", value: "dessert" },
    { label: "Snack", value: "snack" },
    { label: "Entrance", value: "entrance" },
    { label: "Main dish", value: "main_dish" },
    { label: "Side", value: "side" },
    { label: "Other", value: "other" },
  ];
  const categoriesColumn1 = categories.slice(0, categories.length / 2);
  const categoriesColumn2 = categories.slice(categories.length / 2);
  const handleSubmit = () => {
    console.log(
      recipeName,
      recipeGrade,
      ingredients,
      recipeInstructions,
      secretPassword
    );
    setModalVisible(false);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient("");
  };

  return (
    <View style={styles.container}>
      <Button
        title="Create Recipe"
        style={styles.button}
        onPress={() => setModalVisible(true)}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.title}>Create a new recipe</Text>
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                onChangeText={setRecipeName}
                value={recipeName}
                placeholder="Recipe Name"
              />
            </View>
            <Text>Category</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setRecipeCategory(newValue)}
              value={recipeCategory}
            >
              <View style={styles.containerRadioButton}>
                <View style={styles.radioButtonColumn}>
                  {categoriesColumn1.map((category, i) => (
                    <View key={i} style={styles.radioButton}>
                      <RadioButton value={category.value} />
                      <Text>{category.label}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.radioButtonColumn}>
                  {categoriesColumn2.map((category, i) => (
                    <View key={i} style={styles.radioButton}>
                      <RadioButton value={category.value} />
                      <Text>{category.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </RadioButton.Group>
            <Text>Healthiness</Text>
            <Rating
              onFinishRating={setRecipeGrade}
              style={{ paddingVertical: 10 }}
            />
            <View style={styles.containerInputAndIngredients}>
              <View style={styles.ingredientInput}>
                <TextInput
                  style={styles.input}
                  onChangeText={setNewIngredient}
                  value={newIngredient}
                  placeholder="New Ingredient & grams"
                />
                <Button title="+" onPress={handleAddIngredient} />
              </View>
              <View style={styles.ingredientList}>
                {ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredient}>
                    {ingredient} -{" "}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                onChangeText={setRecipeInstructions}
                value={recipeInstructions}
                placeholder="Instructions"
                multiline
              />
            </View>
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                onChangeText={setSecretPassword}
                value={secretPassword}
                placeholder="Secret Password"
                secureTextEntry
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    backgroundColor: "blue",
    margin: 10,
    borderRadius: 5,
  },
  containerInput: {
    width: 300,
  },
  containerInputAndIngredients: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredientInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  ingredient: {
    width: "48%",
    margin: "1%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  containerRadioButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButtonColumn: {
    flexDirection: "column",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    height: 35,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
  },
});
