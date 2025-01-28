import './App.css';

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
        const fullPath = `C:\\Users\\kobko\\Desktop\\Projects\\${directoryHandle.name}`;
        setFolderPath(fullPath);
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

  const addTranslation = () => {
    const newTranslation = {
      key: `key_${translations.length + 1}`,
      english: "",
      hebrew: "",
    };

    setTranslations((prev) => [...prev, newTranslation]);
  };

  const deleteTranslation = (index) => {
    setTranslations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="header">
        <h1>Translation Manager</h1>
        <div className="button-container">
          <button onClick={handleFolderSelection}>Select Project Folder</button>
          <button onClick={saveTranslations}>Save Translations</button>
          <button onClick={addTranslation}>Add Value</button>
        </div>
      </div>
      <div className="scrollable">
        <table border="1">
          <thead>
            <tr>
              <th>Key</th>
              <th>English</th>
              <th>Hebrew</th>
              <th style={{ width: "100px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((item, index) => (
              <tr key={item.key}>
                <td>
                  <input
                    type="text"
                    value={editedTranslations[item.key]?.key || item.key}
                    onChange={(e) =>
                      handleInputChange(item.key, "key", e.target.value)
                    }
                  />
                </td>
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
                  <button onClick={() => deleteTranslation(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default TranslationManager;
