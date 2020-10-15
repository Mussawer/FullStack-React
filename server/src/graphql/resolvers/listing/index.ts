import { ObjectId } from "mongodb";
import { IResolvers } from "apollo-server-express";
import { Database, Listing } from "../../../lib/types";

// Apollo Server provides some interface types to help better define the types of a resolvers map
// The IResolvers interface helps enforce our resolvers map object to only contain either resolver fields
// or resolver functions themselves.
export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    }
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({
        _id: new ObjectId(id)
      });

      if (!deleteRes.value) {
        throw new Error("failed to delete listing");
      }

      return deleteRes.value;
    }
  },
  // A listing document in our collection contains an _id field while our API specifies an id field in our schema.
  // Since the listing obj being passed from the root fields doesn’t contain an id field without an underscore, we’ll
  // need to define a resolver for id .
  Listing: {
    id: (listing: Listing): string => listing._id.toString()
  }
};
