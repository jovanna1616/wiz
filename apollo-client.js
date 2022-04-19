import { ApolloClient, InMemoryCache } from "@apollo/client";
import * as models from "./models";

const rootQueryFields = Object.fromEntries(
  Object.values(models)
    .filter(({ rootQueryKey }) => !!rootQueryKey)
    .map(({ rootQueryKey, rootQueryTypePolicy }) => [
      rootQueryKey,
      rootQueryTypePolicy,
    ])
);

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_RICK_AND_MORTY,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: rootQueryFields,
      },
    },
  }),
});

export default client;
