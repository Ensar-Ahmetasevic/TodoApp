const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Create new ToDo URL in DB
  if (req.method === "POST") {
    const { url, todoID } = req.body;

    if (!url) {
      res.status(422).json({ message: "Backend cannot receive AWS URL." });
      return;
    }

    try {
      await prisma.awsUrl.create({
        data: { url: url, todo: { connect: { id: todoID } } },
      });
      res.status(200).json({ message: "Todo item added successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to add todo item.", error: error.message });
    }

    return;
  }

  if (req.method === "GET") {
    const todoId = parseInt(req.query.todoId);
    console.log("Backend totoID:", todoId);
    //
    try {
      const url = await prisma.awsUrl.findMany({
        where: { todoId: todoId },
        orderBy: { id: "desc" },
      });
      res.status(200).json({ url });
      console.log("Backend AWS URL:", url);
    } catch (error) {
      res.status(500).json({
        message: "Failed to send AWS URLs from DB.",
        error: error.message,
      });
    }
    return;
  }
}
