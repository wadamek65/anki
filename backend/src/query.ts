import { QueryResolvers } from './__generated__/resolvers';
import { AuthData } from './apollo';
import { Card, Deck, User as DBUser } from './schemas';

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

const user: Resolvers['user'] = async (_parent, _args, { name, email, picture }) => {
	const userInfo = await DBUser.findOne({ email });
	if (!userInfo) {
		return await new DBUser({ email, name, avatar: picture }).save();
	}

	return userInfo;
};

export const Query: Resolvers = {
	card,
	deck,
	decks,
	user
};
