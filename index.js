const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.scgvwg0.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const toysStoreCollection = client.db("").collection("toys");
    const addToysDataCollection = client.db("addToysDB").collection("addtoys");

    const toysCollections = client.db("toysStoreDB").collection("toys");

    //  get data from collections
    app.get("/toys", async (req, res) => {
      const data = await toysCollections.find().toArray();
      res.send(data);
    });

    // CRUD OPERATION- Post -method here
    app.post("/addtoys", async (req, res) => {
      const addToys = req.body;
      const result = await addToysDataCollection.insertOne(addToys);
      res.send(result);
    });

    // ----------------------

    app.get("/addtoys", async (req, res) => {
      const data = await addToysDataCollection.find().toArray();
      res.send(data);
    });

    //  here is query using email
    app.get("/addtoys/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const result = await addToysDataCollection.find(query).toArray();
      res.send(result);
    });

    // here is crud operation delete method for single details
    app.get("/addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToysDataCollection.findOne(query);
      res.send(result);
    });

    //for delete operation
    app.delete("/addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToysDataCollection.deleteOne(query);

      res.send(result);
    });
    
    
    // for update data
    app.patch("/addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedToy = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          price: updatedToy.price,
          available: updatedToy.available,
          details: updatedToy.details,
        },
      };
      const result = await addToysDataCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ modifiedCount: result.modifiedCount });
    });
    
    app.get("/updateData", async (req, res) => {
      let query = {};
      if (req.query?._id) {
        query = { _id: new ObjectId(req.query._id) };
      }
      const result = await addToysDataCollection.find(query).toArray();
      res.send(result);
    });
    
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toy marketplace is running");
});

app.listen(port, () => {
  console.log(`Toy marketplace is running on port ${port}`);
});


