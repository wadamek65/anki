import { Card, User } from './schemas';

const createUser = async (parent, args) => {
	const { name } = args.input;
	return new User({ name }).save();
};

const createCard = async (parent, args) => {
	const { language, word, translations, note } = args.input;
	return new Card({ language, word, translations, note }).save();
};

export const Mutation = {
	createUser,
	createCard
};
