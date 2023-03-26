const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { getSession } from "next-auth/client";

async function handler(req, res) {
  //
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated", status: false });
    return;
  }

  // Sending all datas from DB
  if (req.method === "GET" && req.url === "/api/items") {
    try {
      const allItems = await prisma.todo.findMany({
        where: { userId: session.user.id },
        orderBy: { id: "desc" },
      });
      res.status(200).json({ allItems });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve todo items.",
        error: error.message,
      });
    }
    return;
  }

  // Create new todos in DB
  if (req.method === "POST" && req.url === "/api/items") {
    const { text, checkBox } = req.body;

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    try {
      await prisma.todo.create({
        data: { text, checkBox, user: { connect: { id: session.user.id } } },
      });
      res.status(200).json({ message: "Todo item added successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to add todo item.", error: error.message });
    }

    return;
  }

  //  delete a todo item in DB
  if (req.method === "DELETE" && req.url === "/api/items") {
    const { id } = req.body;

    try {
      await prisma.todo.delete({
        where: { id: id },
      });

      res.status(200).json({ message: "Todo item deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete todo item.", error: error.message });
    }

    return;
  }

  // edit/update a todo item
  if (req.method === "PUT" && req.url == "/api/items") {
    const { id, text } = req.body;

    try {
      await prisma.todo.update({
        where: { id: id },
        data: { text: text },
      });

      res
        .status(200)
        .json({ message: "Todo item has been successfully updated." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete todo item.", error: error.message });
    }
  }

  //  update the checkBox state

  if (req.method === "PATCH" && req.url == "/api/items") {
    const { id, checkBox } = req.body;

    try {
      await prisma.todo.update({
        where: { id: id },
        data: { checkBox: checkBox },
      });
      res
        .status(200)
        .json({ message: "Valu of checkBox has been successfully updated." });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update the value of checkBox.",
        error: error.message,
      });
    }
  }
}

export default handler;
