import React, { useState } from "react";
import axios from "axios";

function TranslationManager() {
  const [folderPath, setFolderPath] = useState("");
  const [translations, setTranslations] = useState([]);
  const [editedTranslations, setEditedTranslations] = useState([]);

  const handleFolderSelection = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();

      if (directoryHandle) {
        setFolderPath(directoryHandle.name);
        const fullPath = `C:\\Users\\kobko\\Desktop\\Projects\\${directoryHandle.name}`;
        console.log(fullPath);

        loadTranslations(fullPath)
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
      alert("Failed to select folder.");
    }
  };

  const loadTranslations = async (path) => {
    try {
      const response = await axios.post("http://localhost:5000/api/load-translations", {
        folderPath: path,
      });
      setTranslations(response.data);
    } catch (error) {
      console.error("Error loading translations:", error);
      alert("Failed to load translations. Please check the folder path.");
    }
  };

  const handleInputChange = (key, field, value) => {
    setEditedTranslations((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const saveTranslations = async () => {
    try {
      const updatedTranslations = translations.map((item) => ({
        ...item,
        ...editedTranslations[item.key],
      }));
      await axios.post("http://localhost:5000/api/save-translations", {
        folderPath,
        translations: updatedTranslations,
      });
      alert("Translations saved successfully!");
    } catch (error) {
      console.error("Error saving translations:", error);
      alert("Failed to save translations.");
    }
  };

  return (
    <div>
      <h1>Translation Manager</h1>
      <button onClick={handleFolderSelection}>Select Project Folder</button>
      <table border="1">
        <thead>
          <tr>
            <th>English</th>
            <th>Hebrew</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody>
          {translations.map((item) => (
            <tr key={item.key}>
              <td>
                <input
                  type="text"
                  value={editedTranslations[item.key]?.english || item.english}
                  onChange={(e) =>
                    handleInputChange(item.key, "english", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={editedTranslations[item.key]?.hebrew || item.hebrew}
                  onChange={(e) =>
                    handleInputChange(item.key, "hebrew", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={editedTranslations[item.key]?.key || item.key}
                  onChange={(e) =>
                    handleInputChange(item.key, "key", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveTranslations}>Save Translations</button>
    </div>
  );
}

export default TranslationManager;
