import { ApolloServer, AuthenticationError } from 'apollo-server';
import { OAuth2Client } from 'google-auth-library';
import { importSchema } from 'graphql-import';

import { connectionResolver, edgeResolver, paginatedQuery } from './relayHelpers';
import { Query } from './query';
import { Card, Deck as DBDeck, DeckInterface, UserInterface } from './schemas';

const Node = {
	__resolveType(obj) {
		if (obj.word) {
			return 'Card';
		}

		if (obj.name) {
			return 'User';
		}

		if (obj.title) {
			return 'Deck';
		}

		return;
	}
};

const User = {
	decks(parent: UserInterface, args) {
		return paginatedQuery(DBDeck.find({ owner: parent.email }), args);
	}
};

const Deck = {
	cards(parent: DeckInterface, args) {
		return paginatedQuery(Card.find({ _id: { $in: parent.cards.map(card => card.toString()) } }), args);
	}
};

const resolvers = {
	CardConnection: connectionResolver,
	CardEdge: edgeResolver,
	DeckConnection: connectionResolver,
	DeckEdge: edgeResolver,

	Deck,
	User,

	Node,
	Query
};

const typeDefs = importSchema('../schema.graphql');

const CLIENT_ID = '561207995036-g3g2jjd7af267q2q7vfb8tdqhahkn0f8.apps.googleusercontent.com';
const authClient = new OAuth2Client(CLIENT_ID);

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
			// const ticket = await authClient.verifyIdToken({
			// 	idToken: req.headers['x-access-token'] as string,
			// 	audience: CLIENT_ID
			// });
			// const { email, name, picture } = ticket.getPayload();
			const { email, name, picture } = {
				email: 'wadamek65@gmail.com',
				name: 'Wojciech Adamek',
				picture: 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
			};

			return { name, email, picture };
		} catch {
			throw new AuthenticationError('Unauthenticated.');
		}
	}
});
