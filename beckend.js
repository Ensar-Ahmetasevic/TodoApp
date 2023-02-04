import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
  // connect to MongoDB
  const client = await MongoClient.connect(
    "mongodb+srv://Ensar_MongoDB:G6nOlo0WUDHxntqV@cluster0.1odepbc.mongodb.net/Items?retryWrites=true&w=majority"
  );

  const db = client.db("ToDo_App");
  const todoCollection = db.collection("Items");

  // handle updating a todo item
  if (req.method === "PUT") {
    const { id, text } = req.body;

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    // find and update the todo item in the database
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

  // handle creating a new todo item
  if (req.method === "POST") {
    const { text } = req.body;

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    // insert the new todo item into the database
    try {
      await todoCollection.insertOne({ text: text });

      res.status(200).json({ message: "Todo item added successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to add todo item." });
    }

    return;
  }

  // handle retrieving all todo items
  if (req.url === "/api/api_items" && req.method === "GET") {
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

  // return error for unsupported methods
  res.status(405).json({ message: "Method not allowed." });
}

export default handler;
