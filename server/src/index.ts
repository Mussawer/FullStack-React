require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

// With an Apollo Server instance created, the apollo-server-express
// library allows us to specify middleware that works
// alongside the existing server middleware. It’s in this middleware where we can pass in the express app instance as well
// as specify the endpoint for where our GraphQL API should live.

// The ApolloServer() constructor can take in a series of options needed to instantiate the Apollo Server instance.
// The conventional options that can often be passed in are the:
// typeDefs : String that represents the entire GraphQL schema.
// resolvers : Map of functions that implement the schema.

// this mount() function will be the parent function to run to essentially start our Node Express server.
// The mount() function will accept the Express app instance and do what we’ve done before by instantiating the
// Apollo Server, applying the necessary middleware, and having our app listen on the appropriate port.
const mount = async (app: Application) => {
  const db = await connectDatabase();
  // The context argument is an object that is shared by all resolvers in a GraphQL API.
  // The context argument is useful in passing information that all or many resolvers may need such as database connections.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db })
  });

  server.applyMiddleware({ app, path: "/api" });
  app.listen(process.env.PORT);

  console.log(`[app] : http://localhost:${process.env.PORT}`);
};

mount(express());

// Note: You will need to introduce a .env file at the root of the project
// that has the PORT, DB_USER, DB_USER_PASSWORD, and DB_CLUSTER environment variables defined.
// Otherwise, the server will not be able to start and/or connect to the database
