import { Deck } from './schemas';

const createDeck = async (parent, args) => {
	const { title } = args.input;
	return new Deck({ title }).save();
};

export const Mutation = {
	createDeck
};
