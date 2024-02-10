const express = require('express');
const dbConnection = require('./db.tsx');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());


// Routes
app.post('/identities', (req, res) => {
    dbConnection.query('select * from contacts', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
        }
        console.log('Query results:', results);
    });
    res.status(201).send('successfull request');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
