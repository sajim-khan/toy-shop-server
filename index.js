const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://toymarket:npywgQ06NOr8bXoy@cluster0.scgvwg0.mongodb.net/?retryWrites=true&w=majority";

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

    const toysCollections = client.db("toysStoreDB").collection("toys");

    app.get("/toys", async (req, res) => {
      const data = await toysCollections.find().toArray();
      res.send(data);
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
