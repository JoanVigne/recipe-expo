import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ScrollView,
  Keyboard,
} from "react-native";
/* import { RadioButton } from "react-native-paper"; */
import { Picker } from "@react-native-picker/picker";
import classicIngredients from "../utils/classicIngredients";
import categories from "../utils/categories";
import CategoryRadioButtonGroup from "./CategoryRadioButtonGroup";

export default function RecipeModal({ createRecipe }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeCategory, setRecipeCategory] = useState(null);
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
  const columnSize = Math.ceil(categories.length / 3);
  // Step 2: Create three columns
  const categoriesColumn1 = categories.slice(0, columnSize);
  const categoriesColumn2 = categories.slice(columnSize, 2 * columnSize);
  const categoriesColumn3 = categories.slice(2 * columnSize); // This will automatically go to the end of the array

  const handleSubmit = () => {
    // verification form ok
    if (
      recipeName.trim() === "" ||
      ingredients.length === 0 ||
      recipeInstructions.trim() === "" ||
      secretPassword.trim() !== "coco"
    ) {
      setErrorFormMessage(true);
      setTimeout(() => {
        setErrorFormMessage(false);
      }, 5000);
      return;
    }
    // regrouping the ingredients and quantities and unit
    const ingredientsAndGrammage = ingredients.map((ingredient, index) => ({
      name: ingredient,
      quantity: quants[index],
      unit: selectedValues[index] || "gram",
    }));
    const recipe = {
      name: recipeName,
      ingredients: ingredientsAndGrammage,
      instructions: recipeInstructions,
      category: recipeCategory || "other",
    };
    // function to send to db
    createRecipe(recipe);
    // close modal
    setModalVisible(false);
  };

  const addIngredient = () => {
    Keyboard.dismiss();
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient("");
    setFilteredSuggestions([]);
  };
  const addSuggestion = (suggestion) => {
    Keyboard.dismiss();
    setIngredients([...ingredients, suggestion]);
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
    <ScrollView style={styles.container}>
      <Button title="Create Recipe" onPress={() => setModalVisible(true)} />
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
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                onChangeText={setSecretPassword}
                value={secretPassword}
                placeholder="Secret Password"
                secureTextEntry
              />
            </View>
            <View style={styles.containerInputAndIngredients}>
              <View style={styles.ingredientInput}>
                <TextInput
                  style={styles.inputSearchIngredient}
                  onChangeText={updateIngredientInput}
                  value={newIngredient}
                  placeholder="New Ingredient & grams"
                />
                <Button title="+" onPress={addIngredient} />
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
                    <View key={index} style={styles.suggestionAndButton}>
                      <Text
                        style={styles.suggestion}
                        onPress={() => setNewIngredient(suggestion)}
                      >
                        {suggestion}
                      </Text>
                      <Button
                        title="+"
                        onPress={() => addSuggestion(suggestion)}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.containerTextArea}>
              <TextInput
                style={styles.textArea}
                onChangeText={setRecipeInstructions}
                value={recipeInstructions}
                placeholder="Instructions"
                multiline
              />
            </View>
            <Text>Category</Text>
            {/*   <RadioButton.Group
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
                <View style={styles.radioButtonColumn}>
                  {categoriesColumn3.map((category, i) => (
                    <View key={i} style={styles.radioButton}>
                      <RadioButton value={category.value} />
                      <Text>{category.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </RadioButton.Group>
 */}
            <CategoryRadioButtonGroup
              selectedCategory={recipeCategory}
              setSelectedCategory={setRecipeCategory}
              needAllCategories={false}
            />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
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
    width: 285,
  },
  containerTextArea: {
    width: 275,
    marginTop: 10,
  },
  textArea: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    borderRadius: 3,
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
  inputSearchIngredient: {
    height: 38,
    margin: 5,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    width: 239,
  },
  suggestionsContainer: {
    maxHeight: 100,
    width: 237,
    paddingLeft: 5,
    marginRight: 37,
    borderWidth: 1,
    borderColor: "black",
  },
  suggestionAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  ingredientList: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 2,
    width: 285,
    minHeight: 100,
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
    height: 20,
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
    height: 20,
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
  // RADIO BUTTON CATEGORY
  /*   containerRadioButton: {
    flexDirection: "row",
  },
  radioButtonColumn: {
    flexDirection: "column",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 90,
  }, */
  input: {
    height: 35,
    margin: 5,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    textAlign: "center",
  },
});
