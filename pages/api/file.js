const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Create new ToDo URL in DB
  if (req.method === "POST") {
    const { url, todoID } = req.body;

    if (!url) {
      res.status(422).json({
        message: "Pleas choos your file. Backend cannot receive AWS URL.",
      });
      return;
    }
    try {
      await prisma.awsUrl.create({
        data: { url: url, todo: { connect: { id: todoID } } },
      });
      res.status(200).json({ message: "Your File is added successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to save File.", error: error.message });
    }

    return;
  }

  // Sending all datas from DB
  if (req.method === "GET") {
    const todoId = parseInt(req.query.todoId);

    //
    try {
      const url = await prisma.awsUrl.findMany({
        where: { todoId: todoId },
        orderBy: { id: "desc" },
      });
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrive Files from DB.",
        error: error.message,
      });
    }
    return;
  }

  //  delete a todo item in DB
  if (req.method === "DELETE") {
    const { URLid } = req.body;

    try {
      await prisma.awsUrl.delete({
        where: { id: URLid },
      });

      res.status(200).json({ message: "Your File is deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete File.", error: error.message });
    }

    return;
  }
}
