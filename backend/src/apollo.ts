import { ApolloServer, AuthenticationError } from 'apollo-server';
import { OAuth2Client } from 'google-auth-library';
import { importSchema } from 'graphql-import';

import * as config from '../config.json';
import { DeckResolvers } from './__generated__/resolvers';
import { Mutation } from './mutation';
import { Query } from './query';

const Deck: DeckResolvers = {
	cardsAmount(parent) {
		return parent.cards.length;
	}
};

const resolvers: any = {
	Deck,
	Query,
	Mutation
};

const typeDefs = importSchema(config.app.schemaPath);

const authClient = new OAuth2Client(config.auth.clientId);

export interface AuthData {
	name: string;
	email: string;
	picture: string;
}

export const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }): Promise<AuthData> => {
		try {
			if (config.app.insecureDisableAuth) {
				return {
					email: 'test@mail.com',
					name: 'Test User',
					picture: 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
				};
			}
			console.log(req.headers['x-access-token']);
			const ticket = await authClient.verifyIdToken({
				idToken: req.headers['x-access-token'] as string,
				audience: config.auth.clientId
			});
			return ticket.getPayload() as AuthData;
		} catch {
			throw new AuthenticationError('Unauthenticated.');
		}
	}
});
