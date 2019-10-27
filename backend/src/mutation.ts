import { Deck, User } from './schemas';

const createUser = async (parent, args) => {
	const { name } = args.input;
	return new User({ name }).save();
};

const createDeck = async (parent, args) => {
	const { title } = args.input;
	return new Deck({ title }).save();
};

export const Mutation = {
	createUser,
	createDeck
};
