import { ApolloServer } from "@apollo/server";
import StoryServices from "./Services/StoryServices/index.js";
async function connectApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
     
    
      type Query {
        hello:String
        ${StoryServices.Query}
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello",
        ...StoryServices.resolvers.query,
      },
    },
  });

  return server;
}

export default connectApolloServer;
