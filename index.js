const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
const cors = require('cors');
require('dotenv').config();
const Property = require('./models/property');

// this is all about exprement
const fs = require('fs/promises');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// console.log(process.env.password);


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://Next-i2:${process.env.password}@cluster0.gwibbgy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const properitesCollection = client.db('dreamDwell').collection('properitesInfo');

        // Read (Query) operation
        app.get('/api/items', async (req, res) => {
            try {
                const items = await properitesCollection.find().toArray();
                res.send(items);
            } catch (error) {
                console.error('Error getting items:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        app.post('/api/add-properties', async (req, res) => {
            try {
                const { name, details, price } = req.body;

                // Create a document to be inserted
                const propertyDocument = {
                    name,
                    details,
                    price,
                };

                // Insert a single document
                const result = await properitesCollection.insertOne(propertyDocument);

                console.log('Inserted property ID:', result.insertedId);

                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);




// Route to get all items
app.get('/api/properites', async (req, res) => {
    try {
        // Read data from the JSON file
        const data = await fs.readFile('slider.json', 'utf-8');
        const items = JSON.parse(data);

        // Send the items as a response
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a specific item by ID
app.get('/api/properites/:id', async (req, res) => {
    try {
        // Read data from the JSON file
        const data = await fs.readFile('slider.json', 'utf-8');
        const items = JSON.parse(data);

        // Find the item with the specified ID
        const itemId = parseInt(req.params.id);
        const item = items.find((i) => i.id === itemId);

        // If the item is found, send it as a response; otherwise, send a 404 error
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(` Running but need to go faster port ${port}`)
})