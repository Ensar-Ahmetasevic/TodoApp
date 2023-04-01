// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema


generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  todos    Todo[]
}

model Todo {
  id       Int      @id @default(autoincrement())
  text     String
  checkBox Boolean  @default(false)
  userId   Int
  user     User    @relation(fields: [userId], references: [id])

}

// In the Todo model, the user field is added to create a "many-to-one" relationship with the User model. The userId field is added as
// a foreign key to store the id of the associated User record. In the User model, the todos field is added as a virtual field to define
// the reverse relationship with the Todo model. This allows you to fetch all the todos associated with a user by accessing the todos
// field on a User record.

