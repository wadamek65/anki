import { QueryResolvers } from './__generated__/resolvers';
import { Card, Deck, Session, User as DBUser, UserSchema } from './schemas';

type Resolvers = QueryResolvers<UserSchema>;

const card: Resolvers['card'] = async (parent, { id }, { email }) => {
	const card = await Card.findOne({ _id: id, owner: email });
	if (!card) {
		// TODO: Handle not found
		return undefined as any;
	}
	return card;
};

const deck: Resolvers['deck'] = async (_parent, { id }, { email }) => {
	const deck = await Deck.findOne({ _id: id, owner: email });
	if (!deck) {
		// TODO: Handle not found
		return undefined as any;
	}
	return deck;
};

const decks: Resolvers['decks'] = async (_parent, _args, { email }) => {
	const decks = await Deck.find({ owner: email });
	if (!decks) {
		// TODO: Handle not found
		return undefined as any;
	}
	return decks;
};

const user: Resolvers['user'] = async (_parent, _args, { email }) => {
	const user = await DBUser.findOne({ email });
	if (!user) {
		// TODO: Handle not found
		return undefined as any;
	}
	return user;
};

const studySession: Resolvers['studySession'] = async (parent, { id }, { email }) => {
	const session = await Session.findOne({ _id: id, owner: email });
	if (!session) {
		// TODO: Handle not found
		return undefined as any;
	}
	return session;
};

export const Query: Resolvers = {
	card,
	deck,
	decks,
	user,
	studySession
};
