import { ApolloClient, InMemoryCache } from "@apollo/client";
const URL = import.meta.env.VITE_GRAPH_QL_URL;

const client = new ApolloClient({
  uri: URL,
  cache: new InMemoryCache(),
});

export default client;
