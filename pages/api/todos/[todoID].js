const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function handler(req, res) {
  // Sending all datas from DB
  if (req.method === "GET") {
    const listID = parseInt(req.query.todoID);
    // String value ('1') was provided, that is why we need convert it to Integer value using "parseInt".

    try {
      const allItems = await prisma.todo.findMany({
        where: { todoListId: listID },
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

  // Create new TODOs in DB
  if (req.method === "POST") {
    const { text, checkBox } = req.body;
    const listID = parseInt(req.query.todoID);

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    try {
      await prisma.todo.create({
        data: { text, checkBox, todoList: { connect: { id: listID } } },
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
  if (req.method === "DELETE") {
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
  if (req.method === "PUT") {
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

  if (req.method === "PATCH") {
    const { id, checkBox } = req.body;

    try {
      await prisma.todo.update({
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
