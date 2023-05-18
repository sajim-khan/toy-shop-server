const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toy marketplace is running");
});

app.listen(port, () => {
  console.log(`Toy marketplace is running on port ${port}`);
});