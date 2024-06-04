import { ApolloServer } from "@apollo/server";
import StoryServices from "./Story/index.js";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
async function connectApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
    scalar Upload 

      
     ${StoryServices.typeDefs}

     
      type Query {
        hello:String
        ${StoryServices.Query}
      }

      type Mutation{
        ${StoryServices.Mutations}
      }


    `,
    resolvers: {
      Upload: GraphQLUpload,
      Query: {
        hello: () => "Hello",
        ...StoryServices.resolvers.query,
      },
      Mutation: {
        ...StoryServices.resolvers.mutations,
      },
    },
  });

  return server;
}

export default connectApolloServer;
