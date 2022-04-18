import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Character } from "./models";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_RICK_AND_MORTY,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          characters: Character.mergePolicy,
        },
      },
    },
  }),
});

export default client;
