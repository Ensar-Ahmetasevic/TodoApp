// [...nextauth].js is dynamic catch all API route, which catches all unknown routes that start with "api/auth/*something*"

import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { verifyPassword } from "@/helpers/auth";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default NextAuth({
  /* 
To make sure that a JSON Web Token is created, we should (besides setting up our "providers") also add the "session". 
It's a object where you can configure how that session for an authenticated user will be managed and there, you've got
a "jwt" key which should be set to "true", so that JSON Web Tokens are being used. Also, it I would be set to "true" 
automatically if we don't specify a database, and we aren't specifying a database because we handle all database access 
manually, anyways with this specific provider but nonetheless, setting it to "true" explicitly also isn't too bad.
*/
  session: {
    jwt: true,
  },

  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Wrong password.");
        }

        // If we return an object inside of authorize, we let nextAuth know that authorization succeeded
        // so that the user is logged in. And this object will then actually be encoded into that JSON Web Token.
        return { email: user.email };
        // We could, for example, include the user email. We should not pass the entire user object because we don't
        // wanna include the password. Even though it's hashed, we don't wanna expose that to the client. So that's the
        // object we return and that will then be encoded in a JSON Web Token.
      },
    }),
  ],
});
