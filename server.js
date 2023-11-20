// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/store-tabs', (req, res) => {
    const tabsData = req.body.tabs;

    console.log('Received tabs data:', tabsData);

    // Save the data to a JSON file (replace 'tabs.json' with your desired filename)
    fs.appendFile('tabs.json', JSON.stringify(tabsData) + '\n', (err) => {
        if (err) {
            console.error('Error saving tabs data to file:', err);
            res.sendStatus(500);
        } else {
            console.log('Tabs data saved to file.');
            res.sendStatus(200);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
