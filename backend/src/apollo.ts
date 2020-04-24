import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { importSchema } from 'graphql-import';

import * as config from '../config.json';
import { DeckResolvers } from './__generated__/resolvers';
import { Mutation } from './mutation';
import { Query } from './query';
import { authMiddleware, loginRoute } from './auth';

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

export interface AuthData {
	name: string;
	email: string;
	picture: string;
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }): Promise<AuthData> => {
		return (req as any).user;
	}
});

const corsOptions = { credentials: true, origin: 'http://localhost:3000' };
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(authMiddleware);
app.post('/api/login', loginRoute);

server.applyMiddleware({ app, cors: corsOptions });

export { app };
