const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
const cors = require('cors');
require('dotenv').config();
const Property = require('./models/property');
const { ObjectId } = require('mongodb');


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
        const messageCollection = client.db('dreamDwell').collection('messageCollection');
        const bookingCollection = client.db('dreamDwell').collection('bookingProperty');

        // Read (Query) operation
        // get all property here
        app.get('/api/properites', async (req, res) => {
            try {
                const items = await properitesCollection.find().toArray();
                res.send(items);
            } catch (error) {
                console.error('Error getting items:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add a property in database.
        app.post('/api/add-properties', async (req, res) => {
            try {
                const { name, email, details, image, location, price, bathrooms, rooms } = req.body;
                // Create a document to be inserted
                const propertyDocument = { name, email, details, image, location, price, bathrooms, rooms };

                // Insert a single document
                const result = await properitesCollection.insertOne(propertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add message in database.
        app.post('/api/add-message', async (req, res) => {
            try {
                const { name, email, message } = req.body;
                // Create a document to be inserted
                const propertyDocument = {
                    name,
                    email,
                    message,
                };
                // console.log(propertyDocument);
                // Insert a single document
                const result = await messageCollection.insertOne(propertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add booking data in database.
        app.post('/api/add-bookingProperty', async (req, res) => {
            try {
                const { dataId, name, detail, image, email, price, bathroom, rooms, bookingConfirmed } = req.body;
                // Create a document to be inserted
                const bookingPropertyDocument = {
                    dataId, name, detail, image, email, price, bathroom, rooms, bookingConfirmed
                };
                // console.log(bookingPropertyDocument);
                // Insert a single document
                const result = await bookingCollection.insertOne(bookingPropertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get single property detials...
        app.get('/api/single-properites/:id', async (req, res) => {
            try {
                const itemId = req.params.id;
                // Check if itemId is a valid ObjectId
                if (!ObjectId.isValid(itemId)) {
                    return res.status(400).json({ error: 'Invalid ObjectID' });
                }
                const item = await properitesCollection.findOne({ _id: new ObjectId(itemId) });
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

        // get booking property whith email..
        app.get('/api/booking-properites', async (req, res) => {
            try {
                const userEmail = req.query.email;

                // console.log(userEmail);
                if (!userEmail) {
                    // If email is not provided in query parameters, return a bad request response
                    return res.status(400).json({ error: 'Email parameter is missing' });
                }

                // Query the bookingProperty collection for data with the specified email
                const bookings = await bookingCollection.find({ email: userEmail }).toArray();

                res.status(200).json(bookings);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // booking property delete
        app.delete('/api/delete-booking-property/:id', async (req, res) => {
            try {
                const propertyId = req.params.id;
                console.log(propertyId);
                // Validate ObjectID
                if (!ObjectId.isValid(propertyId)) {
                    return res.status(400).json({ error: 'Invalid ObjectID for property' });
                }
                // Delete the property
                const result = await bookingCollection.deleteOne({ _id: new ObjectId(propertyId) });
                // Check if the deletion was successful
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Property deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Property not found or deletion failed' });
                }
            } catch (error) {
                console.error('Error deleting property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get my-property whith email..
        app.get('/api/myadded-properites', async (req, res) => {
            try {
                const userEmail = req.query.email;

                // console.log(userEmail);
                if (!userEmail) {
                    // If email is not provided in query parameters, return a bad request response
                    return res.status(400).json({ error: 'Email parameter is missing' });
                }

                // Query the bookingProperty collection for data with the specified email
                const bookings = await properitesCollection.find({ email: userEmail }).toArray();
                res.status(200).json(bookings);
            } catch (error) {
                console.error(error);
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

// app.get('/api/properites', async (req, res) => {
//     try {
//         // Read data from the JSON file
//         const data = await fs.readFile('slider.json', 'utf-8');
//         const items = JSON.parse(data);

//         // Send the items as a response
//         res.json(items);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Route to get a specific item by ID
// app.get('/api/properites/:id', async (req, res) => {
//     try {
//         // Read data from the JSON file
//         const data = await fs.readFile('slider.json', 'utf-8');
//         const items = JSON.parse(data);

//         // Find the item with the specified ID
//         const itemId = parseInt(req.params.id);
//         const item = items.find((i) => i.id === itemId);

//         // If the item is found, send it as a response; otherwise, send a 404 error
//         if (item) {
//             res.json(item);
//         } else {
//             res.status(404).json({ error: 'Item not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(` Running but need to go faster port ${port}`)
})