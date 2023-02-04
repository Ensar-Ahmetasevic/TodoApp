function handler(req, res) {
  const itemId = req.query.id;

  // Creat new todo item
  if (req.method === "POST") {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      res.status(422).json({ message: "Invalid input." }); //422 -> invalid input
      return;
    }

    const newItem = {
      id: new Date().toISOString(),
      text,
    };

    console.log(text);
    res.status(201).json({ message: "Added ToDo Item.", item: newItem });
  }

  // Dispaly all items
  if (req.method === "GET") {
    const dummyItemsList = [
      { id: "1", text: "Go to the dentist." },
      { id: "2", text: "Make a dinner." },
    ];

    res.status(200).json({ allItems: dummyItemsList });
  }

  // Edit todo item
  if (req.method === "GET") {
  }

  // Delete todo item
  if (req.method === "DELETE") {
  }
}

export default handler;
