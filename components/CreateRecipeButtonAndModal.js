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
export default function RecipeModal() {
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
      <Button title="Create Recipe" onPress={() => setModalVisible(true)} />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Create a new recipe</Text>
            <TextInput
              style={styles.input}
              onChangeText={setRecipeName}
              value={recipeName}
              placeholder="Recipe Name"
            />
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
            <View style={styles.ingredientInput}>
              <TextInput
                style={styles.input}
                onChangeText={setNewIngredient}
                value={newIngredient}
                placeholder="New Ingredient"
              />
              <Button title="+" onPress={handleAddIngredient} />
            </View>
            {ingredients.map((ingredient, index) => (
              <Text key={index}>{ingredient}</Text>
            ))}
            <TextInput
              style={styles.input}
              onChangeText={setRecipeInstructions}
              value={recipeInstructions}
              placeholder="Instructions"
              multiline
            />
            <TextInput
              style={styles.input}
              onChangeText={setSecretPassword}
              value={secretPassword}
              placeholder="Secret Password"
              secureTextEntry
            />
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 52,
    /*   justifyContent: "center",
    alignItems: "center", */
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  ingredientInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
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
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
