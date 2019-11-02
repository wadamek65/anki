import { ApolloServer, AuthenticationError } from 'apollo-server';
import { OAuth2Client } from 'google-auth-library';
import { importSchema } from 'graphql-import';

import { Mutation } from './mutation';
import { Query } from './query';

const resolvers = {
	Node: {
		__resolveType(obj) {
			if (obj.word !== undefined) {
				return 'Card';
			}

			if (obj.name) {
				return 'User';
			}

			return;
		}
	},
	Query,
	Mutation
};
const typeDefs = importSchema('../schema.graphql');

const CLIENT_ID = '561207995036-g3g2jjd7af267q2q7vfb8tdqhahkn0f8.apps.googleusercontent.com';
const authClient = new OAuth2Client(CLIENT_ID);

export const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		try {
			const ticket = await authClient.verifyIdToken({
				idToken: req.headers['x-access-token'] as string,
				audience: CLIENT_ID
			});
			return ticket.getPayload();
		} catch {
			throw new AuthenticationError('Unauthenticated.');
		}
	}
});
