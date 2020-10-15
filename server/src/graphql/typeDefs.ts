import { gql } from 'apollo-server-express';

// Apollo Server conventionally allows us to define a GraphQL schema by setting up .
// typeDefs - string that represents the GraphQL schema.

// 'gql' is a function that takes a string as an argument. The string argument has to be constructed with
// template literals. The main takeaway here is that gql is a tag
// (i.e. function) where the argument is derived from the template literal applied alongside it. It takes the string and returns
// a GraphQL Tree.
export const typeDefs = gql`
  type Listing {
    id: ID!
    title: String!
    image: String!
    address: String!
    price: Int!
    numOfGuests: Int!
    numOfBeds: Int!
    numOfBaths: Int!
    rating: Float!
  }

  type Query {
    listings: [Listing!]!
  }

  type Mutation {
    deleteListing(id: ID!): Listing!
  }
`;
