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
import { Picker } from "@react-native-picker/picker";
import classicIngredients from "../utils/classicIngredients";
import categories from "../utils/categories";
export default function RecipeModal({ createRecipe }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeCategory, setRecipeCategory] = useState(null);
  const [recipeGrade, setRecipeGrade] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [quant, setQuant] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [secretPassword, setSecretPassword] = useState("");
  const [errorFormMessage, setErrorFormMessage] = useState(false);
  // is the state of the picker grams, mg, unit, scoop
  const [selectedValues, setSelectedValues] = useState([]);

  const handleValueChange = (itemValue, index) => {
    let newValues = [...selectedValues];
    newValues[index] = itemValue;
    setSelectedValues(newValues);
  };
  // is the state of quantities
  const [quants, setQuants] = useState(ingredients.map(() => ""));

  const handleQuantChange = (text, index) => {
    const newQuants = [...quants];
    newQuants[index] = text;
    setQuants(newQuants);
  };

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
    if (
      recipeName === "" ||
      recipeCategory === null ||
      recipeGrade === 0 ||
      ingredients.length === 0 ||
      recipeInstructions === "" ||
      // if you found this line, yes this is the password to create a recipe
      secretPassword === "coco"
    ) {
      console.log("Please fill in all the fields");
      setErrorFormMessage(true);
      setTimeout(() => {
        setErrorFormMessage(false);
      }, 5000);

      return;
    }
    const recipe = {
      name: recipeName,
      category: recipeCategory,
      grade: recipeGrade,
      ingredients: ingredients,
      instructions: recipeInstructions,
      password: secretPassword,
    };

    createRecipe(recipe);
    setModalVisible(false);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient("");
    setFilteredSuggestions([]);
  };
  const updateIngredientInput = (input) => {
    setNewIngredient(input);
    if (input) {
      const filtered = classicIngredients.filter((ingredient) =>
        ingredient.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
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
                  onChangeText={updateIngredientInput}
                  value={newIngredient}
                  placeholder="New Ingredient & grams"
                />
                <Button title="+" onPress={handleAddIngredient} />
              </View>
              {filteredSuggestions.length <= 0 && ingredients.length > 0 && (
                <View style={styles.ingredientList}>
                  {ingredients.map((ingredient, index) => (
                    <View
                      key={index}
                      style={styles.ContaineringredientAndQuant}
                    >
                      <Text key={`text-${index}`} style={styles.ingredient}>
                        {ingredient}
                      </Text>
                      <View style={styles.containerQuantAndPicker}>
                        <TextInput
                          keyboardType="numeric"
                          style={styles.quant}
                          value={quants[index]}
                          onChangeText={(text) =>
                            handleQuantChange(text, index)
                          }
                          placeholder=""
                        />
                        <Text style={styles.unit} numberOfLines={1}>
                          {selectedValues[index] || "gram"}
                        </Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            style={styles.picker}
                            selectedValue={selectedValues[index] || "gram"}
                            onValueChange={(itemValue, itemIndex) =>
                              handleValueChange(itemValue, index)
                            }
                          >
                            <Picker.Item label="gram" value="gram" />
                            <Picker.Item label="mg" value="mg" />
                            <Picker.Item label="unit" value="unit" />
                            <Picker.Item label="scoop" value="scoop" />
                          </Picker>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {filteredSuggestions.length > 0 && (
                <ScrollView style={styles.suggestionsContainer}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <Text
                      key={index}
                      style={styles.suggestion}
                      onPress={() => setNewIngredient(suggestion)}
                    >
                      {suggestion}
                    </Text>
                  ))}
                </ScrollView>
              )}
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
            {errorFormMessage && (
              <Text style={{ color: "red" }}>
                Please fill in all the fields
              </Text>
            )}
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
  suggestionsContainer: {
    maxHeight: 100,
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  ingredientList: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 2,
    width: 285,
    height: 100,
  },
  ContaineringredientAndQuant: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderColor: "green",
  },
  ingredient: {
    margin: "1%",
  },
  containerQuantAndPicker: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  quant: {
    width: 35,
    margin: "1%",
    paddingHorizontal: 5,
    borderWidth: 1,
  },
  unit: {
    width: 35,
    margin: "1%",
  },
  pickerContainer: {
    width: 40, // Increased size for better touch target
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "green",
    borderWidth: 1,
  },
  picker: {
    marginLeft: 5, // Adjusted for better alignment
    width: "100%",
    height: "100%",
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
    marginBottom: 1,
  },
  input: {
    height: 35,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
  },
});
