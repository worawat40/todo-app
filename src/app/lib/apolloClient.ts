import { ApolloClient, InMemoryCache } from '@apollo/client';

const globalForApollo = globalThis as unknown as {
    apolloClient?: ApolloClient<any>;
};

export const apolloClient =
    globalForApollo.apolloClient ??
    new ApolloClient({
        uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
        headers: {
            'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || '',
        },
        cache: new InMemoryCache(),
    });

if (process.env.NODE_ENV !== 'production') {
    globalForApollo.apolloClient = apolloClient;
}
