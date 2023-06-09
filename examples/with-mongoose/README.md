# Mongoose Example

This is a simple example of Mongoose with Endline.

It contains a model called `Post` in `./src/models/post.js` and a route `/posts` with basic CRUD operations.

## How to set it up

1. Create a MongoDB instance.
2. Create a copy of the `.env.local.example` file and rename it to `.env.local` (Or rename the `.env.local.example` file)
3. Update the connection string variable in the `.env.local` file to match your MongoDB instance.

This example project was created with [`create-endline-app`](https://github.com/zeke-io/endline/tree/master/packages/create-endline-app)
