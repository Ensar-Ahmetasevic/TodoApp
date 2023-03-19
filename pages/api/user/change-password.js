import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "@/helpers/auth";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function handler(req, res) {
  try {
    // Check number one
    if (req.method !== "PATCH") {
      return;
    } // Check number two, is whether that request is coming from an authenticated user or not. And for this, we can again use this "getSession" function.

    const session = await getSession({ req: req });

    // This is a code where we validate whether a request is authenticated or not, with which we protect our API route.
    if (!session) {
      res.status(401).json({ message: "Not authenticated", status: false }); //"error"
      return;
    }

    // Getting email address (which is stored in the DB) is not too difficult, even though it's not part of this form (form from profile-form.js),
    // because we do encode the email address in our token (in "[...nextauth].js") --> " return { email: user.email }". We return that object in
    // our "nextauth" file and that data ends up in the "token" and therefore, it's part of that "session", which we get here (const session = await getSession({ req: req });)

    const userEmail = session.user.email;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      // if "user" is false (the email does not exists in the database)
      res.status(404).json({ message: "User not found", status: false }); //"error";
      return;
    }

    const currentPassword = user.password;

    // Now we wanna verify this and for that, in the "helpers" folder we have this "auth.js" file with the "verifyPassword function".
    const passwordsAreEquale = await verifyPassword(
      oldPassword,
      currentPassword
    ); // returns Boolean

    if (!passwordsAreEquale) {
      // false. Old password (entered in to our form) simply does not match the user's password stored in to our DB.

      res.status(403).json({ message: "Invalid old password.", status: false }); //error
      return;
    }

    if (newPassword.length < 7) {
      res.status(400).json({
        message: "New password must be at least 7 characters long.",
        status: false, //"error"
      });

      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      message: "Password has been successfully updated.",
      status: true, //"success"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong.", status: false }); // "error"
  }
}

export default handler;
