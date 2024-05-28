import { useQuery, gql } from "@apollo/client";

export const Hello = gql`
  query ExampleQuery {
    hello
  }
`;
