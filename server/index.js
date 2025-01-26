// Node.js: Server-side code
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get translations from a specific folder
app.post('/api/load-translations', (req, res) => {
    const { folderPath } = req.body;

    const i18nPath = path.join(folderPath, 'lib', 'i18n');
    console.log(i18nPath);

    const enFilePath = path.join(i18nPath, 'strings_en.i18n.json');
    const heFilePath = path.join(i18nPath, 'strings_he.i18n.json');

    if (!fs.existsSync(enFilePath) || !fs.existsSync(heFilePath)) {
        return res.status(404).json({ error: 'Translation files not found in the specified folder.' });
    }

    const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));
    const heData = JSON.parse(fs.readFileSync(heFilePath, 'utf-8'));

    const combinedData = Object.keys(enData).map((key) => ({
        key,
        english: enData[key] || '',
        hebrew: heData[key] || '',
    }));

    res.json(combinedData);
});

// Endpoint to save translations
app.post('/api/save-translations', (req, res) => {
    const { folderPath, translations } = req.body;
    const i18nPath = path.join(folderPath, 'lib', 'i18n');

    const enFilePath = path.join(i18nPath, 'strings_en.i18n.json');
    const heFilePath = path.join(i18nPath, 'strings_he.i18n.json');

    const enData = {};
    const heData = {};

    translations.forEach(({ key, english, hebrew }) => {
        enData[key] = english;
        heData[key] = hebrew;
    });

    fs.writeFileSync(enFilePath, JSON.stringify(enData, null, 2));
    fs.writeFileSync(heFilePath, JSON.stringify(heData, null, 2));

    res.json({ message: 'Translations saved successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
