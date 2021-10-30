const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());


//uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgg2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

//Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("travelAgency");
        const planCollection = database.collection("tourPlan")

        // get api
        app.get('/tours', async (req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        })
        // get api by id
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await planCollection.findOne(query);
            res.send(result)
        })
        // delete api by id
        app.delete('/tours/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await planCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel related server');
})

app.listen(port, () => {
    console.log('listening to the port ', port);
})