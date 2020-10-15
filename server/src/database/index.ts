import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${
  process.env.DB_USER_PASSWORD
}@${process.env.DB_CLUSTER}.mongodb.net`;

// TypeScript natively provides a Promise interface which accepts a type
// variable with which will be the type of the resolved promise value
export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("main");

  return {
    listings: db.collection("test_listings")
  };
};
