const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function handler(req, res) {
  const userId = req.query.userId;

  if (req.method === "POST") {
    const { text, checkBox } = req.body;

    if (!text) {
      res.status(422).json({ message: "Please enter your todo item." });
      return;
    }

    console.log(text, checkBox);
  }

  // Sending all datas from DB
  if (req.method === "GET") {
    try {
      const allItems = await prisma.todo.findMany({
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
}

export default handler;
