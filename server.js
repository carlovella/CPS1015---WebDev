const express = require('express'); // Import express
const app = express();
const fs = require('fs');

// File to store player data
const dataFile = 'data.json';
// Object to store data
let playerDataStore = {};

// Middleware to serve static frontend files and parse JSON requests
app.use(express.static('.'));
app.use(express.json());

// Load saved data from file
if (fs.existsSync(dataFile)) {
    try{
        const file = fs.readFileSync(dataFile, 'utf8');
        playerDataStore = JSON.parse(file);
    }catch (error){
        console.error('Failed to load data');
        playerDataStore = {};
    }
}

// Load Game Data
app.get('/gameData', (req, res) => {
    try{
        res.status(200).json(playerDataStore);
    } catch(error){
        console.error('Failed to load game');
        res.status(500).json({message: 'Failed to load game'});
    }
})

// Save Game Data
app.post('/gameData', (req, res) => {
    try{
        playerDataStore = req.body;
        fs.writeFileSync(dataFile, JSON.stringify(playerDataStore, null,2));
        res.status(200).json({message: 'Game data saved'});
    }catch (error){
        console.error('Failed to save game');
        res.status(500).json({message: 'Failed to save game'});
    }
})

// Start Server
app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});