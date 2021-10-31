const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require("mongodb").ObjectId;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle war 
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez71i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('foodDelivery');
        const foodCollection = database.collection('FoodItem');

        // add POST API 
        app.post("/addFoods", async (req, res) => {
            const result = await foodCollection.insertOne(req.body);
            res.send(result);
        });

        // get all Food
        app.get("/foods", async (req, res) => {
            const result = await foodCollection.find({}).toArray();
            res.send(result);
        })

        // get one item food 
        app.get('/foodsDetail/:id', async (req, res) => {
            const result = await foodCollection.findOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        })

        // Delete food item 
        app.delete('/foodItem/:id', async (req, res) => {
            const result = await foodCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.json(result);
        });

        // update food
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const result = await foodCollection.updateOne({ _id: ObjectId(id) }, {
                $set: {
                    name: updateInfo.name,
                    price: updateInfo.price,
                    url: updateInfo.url,
                    Foodtype: updateInfo.Foodtype,
                    description: updateInfo.description,
                },
            })
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! Are you Hungry???, we are ready to food delivery')
})

app.listen(port, () => {
    console.log(`Food delivery server start at http://localhost:${port}`)
})