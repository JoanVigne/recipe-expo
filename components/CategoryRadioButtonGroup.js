import categories from "../utils/categories";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

const CategoryRadioButtonGroup = ({
  selectedCategory,
  setSelectedCategory,
  needAllCategories,
}) => {
  const columnSize = Math.ceil(categories.length / 3);
  // Step 2: Create three columns
  const categoriesColumn1 = categories.slice(0, columnSize);
  const categoriesColumn2 = categories.slice(columnSize, 2 * columnSize);
  const categoriesColumn3 = categories.slice(2 * columnSize);

  React.useEffect(() => {
    if (needAllCategories === true) {
      setSelectedCategory("All");
    }
  }, [needAllCategories]);

  return (
    <RadioButton.Group
      onValueChange={(newValue) => setSelectedCategory(newValue)}
      value={selectedCategory}
    >
      {needAllCategories && (
        <View style={styles.radioButton}>
          <RadioButton value="All" />
          <Text>All</Text>
        </View>
      )}
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
  );
};

const styles = StyleSheet.create({
  containerRadioButton: {
    flexDirection: "row",
  },
  radioButtonColumn: {
    flexDirection: "column",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 90,
  },
});
export default CategoryRadioButtonGroup;
