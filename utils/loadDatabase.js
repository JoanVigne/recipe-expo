import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const loadDatabase = async () => {
  const dbName = "myRecipeDB.db";
  const dbAsset = require("../assets/myRecipeDB.db");

  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  // Always create the directory
  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
    intermediates: true,
  });

  // Check if the database file already exists
  const dbExists = await FileSystem.getInfoAsync(dbFilePath);

  if (!dbExists.exists) {
    // Download the database only if it does not exist
    await FileSystem.downloadAsync(dbUri, dbFilePath);
    console.log("Database downloaded and set up.");
  } else {
    console.log("Database already exists, skipping download.");
  }
};

export default loadDatabase;
