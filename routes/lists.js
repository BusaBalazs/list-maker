const express = require("express");
const { ObjectId } = require("mongodb");
const route = express.Router();

const db = require("../data/database");

//--------------------------------------------------------
//********* ROUTES
//--------------------------------------------------------

// LANDING
route.get("/", async (req, res) => {
  const lists = await db.getDb().collection("lists").find().toArray();
  res.render("index", { lists: lists });
});

// CREATE NEW LIST
route.post("/add", async (req, res) => {
  const newListData = {
    listName: req.body.listName,
  };

  await db.getDb().collection("lists").insertOne(newListData);
  res.redirect("/");
});

// FETCH ITEMS
route.get("/get/:id", async (req, res) => {
  const actualListId = ObjectId(req.params.id);

  const doingList = await db
    .getDb()
    .collection("listofdoing")
    .find({ listId: actualListId })
    .toArray();
  res.json(doingList);
});

// SAVE NEW ITEMS
route.post("/:id", async (req, res) => {
  const listId = new ObjectId(req.params.id);
  const newItem = {
    listId: listId,
    text: req.body.listItem,
  };

  await db.getDb().collection("listofdoing").insertOne(newItem);

  res.json({ message: "Item added!" });
});

// DELETE ALL LIST
route.post("/:id/delete", async (req, res) => {
  const listId = new ObjectId(req.params.id);

  await db.getDb().collection("lists").deleteOne({ _id: listId });
  await db.getDb().collection("listofdoing").deleteMany({ listId: listId });

  res.redirect("/");
});

route.post("/deleteitem/:id", async (req, res) => {
  const itemid = req.params.id;

  await db
    .getDb()
    .collection("listofdoing")
    .deleteOne({ _id: ObjectId(itemid) });

  res.json({ message: "Item delete!" });
});

// EDIT ITEM
route.post("/editing/:id", (req, res) => {
  const itemId = ObjectId(req.params.id);
  const editedValue = req.body.listItem;
  console.log(editedValue);
  db.getDb()
    .collection("listofdoing")
    .updateOne({ _id: itemId }, { $set: { text: editedValue } });
  res.json({ message: "Item edited!" });
});
module.exports = route;
