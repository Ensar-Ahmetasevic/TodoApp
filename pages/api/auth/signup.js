import { hashPassword } from "@/helpers/auth";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function handlerSignup(req, res) {
  // Inserting new user email and password in DB
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          "Please enter your email and password (password should at least be 7 characters long).",
        status: false,
      }); //error
      return;
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        // if "existingUser" is true (the email already exists in the database)
        res.status(422).json({ message: "User already exists", status: false }); //error
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error", status: false }); //error
      return;
    }

    const hashedPassword = await hashPassword(password);

    try {
      await prisma.user.create({ data: { email, password: hashedPassword } });

      res
        .status(200)
        .json({ message: "User successfully created", status: true }); //success
    } catch (error) {
      res
        .status(500)
        .json({ message: "Could not save email and password.", status: false }); //error
      return;
    }
  }
}

export default handlerSignup;
