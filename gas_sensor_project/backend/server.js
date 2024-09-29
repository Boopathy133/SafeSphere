const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = 5000;

// Use CORS to allow requests from the frontend
app.use(cors());

// Endpoint to get sensor data
app.get('/api/sensor-data', (req, res) => {
    const results = [];
    const csvFilePath = path.join(__dirname, '../python/sensor_data.csv'); // Adjust path to your CSV file

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        })
        .on('error', (error) => {
            console.error(error);
            res.status(500).send('Error reading CSV file.');
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
