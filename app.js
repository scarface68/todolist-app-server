const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

const mongoDBUrl = "mongodb://127.0.0.1:27017/svietDB";
mongoose.connect(mongoDBUrl);

const itemSchema = mongoose.Schema({
  completed: Boolean,
  isEditing: Boolean,
  task: String,
  //   id mongodb will give us  _id, __v
});

const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
  Item.find({})
    .then((items) => res.json(items))
    .catch((err) => res.json(err));
});

app.post("/items", async (req, res) => {
  const recievedData = req.body.task;
  const newItem = new Item({
    completed: false,
    isEditing: false,
    task: recievedData,
  });
  try {
    newItem.save();
    res.json(newItem);
  } catch (error) {
    res.json(error);
  }
});

app.patch("/items/:id", async (req, res) => {
  Item.findOne({ _id: req.params.id }).then((item) => {
    const toBeChanged = req.body.toBeChanged;
    const task = req.body.task;
    if (task) item.task = task;
    item[toBeChanged] = !item[toBeChanged];
    item.save();
    res.json(item);
  });
});

app.delete("/items/:id", async (req, res) => {
  Item.deleteOne({ _id: req.params.id })
    .then((deletedItem) => res.json(deletedItem))
    .catch((err) => res.json(err));
});

app.listen(PORT, (error) => {
  console.log(`Server is Successfully Running on port ${PORT}`);
});
