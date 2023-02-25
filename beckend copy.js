import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
  // connect to MongoDB
  const client = await MongoClient.connect(
    "mongodb+srv://Ensar_MongoDB:G6nOlo0WUDHxntqV@cluster0.1odepbc.mongodb.net/Items?retryWrites=true&w=majority"
  );

  const db = client.db("ToDo_App");
  const todoCollection = db.collection("Items");

  // insert the new todo item into the database
  if (req.method === "POST") {
    const { text, checkBox } = req.body;

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    try {
      await todoCollection.insertOne({ text, checkBox });

      res.status(200).json({ message: "Todo item added successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to add todo item." });
    }

    return;
  }

  // handle retrieving all todo items
  if (req.url === "/api/items" && req.method === "GET") {
    try {
      const allItems = await todoCollection
        .find({})
        .sort({ _id: -1 })
        .toArray();

      res.status(200).json({ allItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve todo items." });
    }

    return;
  }

  // find and update the todo item in the database
  if (req.method === "PUT") {
    const { id, text } = req.body;

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    try {
      await todoCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { text: text } }
      );

      res.status(200).json({ message: "Todo item updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to update todo item." });
    }

    return;
  }

  // handle deleting a todo item
  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await todoCollection.deleteOne({ _id: ObjectId(id) });

      res.status(200).json({ message: "Todo item deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete todo item." });
    }

    return;
  }

  // update checkbox
  if (req.method === "PATCH") {
    const { id, checkBox } = req.body;

    try {
      await todoCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { checkBox: checkBox } }
      );
      res.status(200).json({ message: "Todo item updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating checkBox",
        error,
      });
    }
  }
  // close the MongoDB connection
  client.close();
}

export default handler;
