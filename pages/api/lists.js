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

  // Create new LIST in DB
  if (req.method === "POST") {
    const { listName } = req.body;

    if (!listName) {
      res.status(422).json({ message: "Please enter your new Todo List." });
      return;
    }

    try {
      await prisma.todoList.create({
        data: { name: listName, user: { connect: { id: session.user.id } } },
        // The connect keyword is used to connect the new TodoList object to the User who created it.
        // user: { connect: { id: session.user.id } } ===  userId: session.user.id
      });
      res.status(200).json({ message: "New Todo List added successfully." });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add new Todo List.",
        error: error.message,
      });
    }

    return;
  }

  // Sending all datas from DB
  if (req.method === "GET") {
    try {
      const allLists = await prisma.todoList.findMany({
        where: { userId: session.user.id },
        orderBy: { id: "desc" },
      });
      res.status(200).json({ allLists });
    } catch (error) {
      res.status(500).json({
        message: "Failed to to catch Todo List.",
        error: error.message,
      });
    }
    return;
  }

  //  delete a todo item in DB
  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await prisma.todoList.delete({
        where: { id: id },
      });

      res.status(200).json({ message: "Todo list deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete todo list.", error: error.message });
    }

    return;
  }

  // edit/update a todo item
  if (req.method === "PUT") {
    const { id, name } = req.body;

    try {
      await prisma.todoList.update({
        where: { id: id },
        data: { name: name },
      });

      res
        .status(200)
        .json({ message: "Todo list has been successfully updated." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete todo list.", error: error.message });
    }
  }

  //  update the checkBox state

  if (req.method === "PATCH") {
    const { id, checkBox } = req.body;

    try {
      await prisma.todoList.update({
        where: { id: id },
        data: { checkBox: checkBox },
      });
      res.status(200).json({
        message: "Valu of checkBox has been successfully updated.",
        checkBox,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update the value of checkBox.",
        error: error.message,
      });
    }
  }
}

export default handler;
