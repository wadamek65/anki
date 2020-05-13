import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { importSchema } from 'graphql-import';

import * as config from '../config.json';
import { DeckResolvers, LanguageResolvers } from './__generated__/resolvers';
import { Mutation } from './mutation';
import { Query } from './query';
import { authMiddleware, loginRoute, refreshTokenRoute } from './auth';
import { Card, UserSchema } from './schemas';

const Deck: DeckResolvers = {
	cardsAmount(parent) {
		return parent.cards.length;
	},
	async cards(parent) {
		return Card.find({ _id: { $in: parent.cards } }) as any;
	}
};

const Language: LanguageResolvers<UserSchema> = {
	id: (parent, args, context) => {
		if (typeof parent === 'string') {
			const language = context.appSettings.languages.id(parent);
			if (!language) {
				return 'default';
			}
			return language.id;
		}
		return parent.id;
	},
	name: (parent, args, context) => {
		if (typeof parent === 'string') {
			const language = context.appSettings.languages.id(parent);
			if (!language) {
				return 'unknown';
			}
			return language.name;
		}
		return parent.name;
	},
	color: (parent, args, context) => {
		if (typeof parent === 'string') {
			const language = context.appSettings.languages.id(parent);
			if (!language) {
				return '#000';
			}
			return language.color;
		}
		return parent.color;
	}
};

const resolvers: any = {
	Deck,
	Language,
	Query,
	Mutation
};

const typeDefs = importSchema(config.app.schemaPath);

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }): Promise<UserSchema> => {
		return (req as any).user;
	}
});

const corsOptions = { credentials: true, origin: 'http://localhost:3000' };
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(authMiddleware);
app.post('/api/login', loginRoute);
app.post('/api/login/refresh', refreshTokenRoute);

server.applyMiddleware({ app, cors: corsOptions });

export { app };
