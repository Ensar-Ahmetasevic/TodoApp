import { getSession } from "next-auth/client";
import { verifyPassword } from "@/helpers/auth";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return;
    }

    // Check whether that request is coming from an authenticated user or not.
    const session = await getSession({ req: req });

    // This is a code where we validate whether a request is authenticated or not, with which we protect our API route.
    if (!session) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const currentPassword = user.password; // hashed password from DB
    const { enteredPassword } = req.body; // NOT hashed password coming from frontend form

    const passwordsAreEquale = await verifyPassword(
      enteredPassword,
      currentPassword
    ); // returns Boolean

    if (!passwordsAreEquale) {
      //passwordsAreEquale === false, then old password (entered in to our form) simply does not match the user's password stored in our DB.
      res.status(403).json({ message: "You entered the wrong password." }); //error
      return;
    }

    const id = user.id;

    // We need to delete the associated TodoLists before deleting the user
    await prisma.todoList.deleteMany({
      where: { userId: id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Backend error: Something went wrong." });
  }
}

export default handler;
