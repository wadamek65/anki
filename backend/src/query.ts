import { QueryResolvers } from './__generated__/resolvers';
import { AuthData } from './apollo';
import { Card, Deck, Session, User as DBUser } from './schemas';

type Resolvers = QueryResolvers<AuthData>;

const card: Resolvers['card'] = async (parent, { id }, { email }) => {
	return Card.findOne({ _id: id, owner: email });
};

const deck: Resolvers['deck'] = async (_parent, { id }, { email }) => {
	return Deck.findOne({ _id: id, owner: email });
};

const decks: Resolvers['decks'] = async (_parent, _args, { email }) => {
	return Deck.find({ owner: email });
};

const user: Resolvers['user'] = async (_parent, _args, { email }) => {
	return DBUser.findOne({ email });
};

const studySession: Resolvers['studySession'] = async (parent, { id }, { email }) => {
	return Session.findOne({ _id: id, owner: email });
};

export const Query: Resolvers = {
	card,
	deck,
	decks,
	user,
	studySession
};
