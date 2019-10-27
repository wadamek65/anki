import { Deck, User } from './schemas';

const getUser = async (parent, args) => {
	return await User.findById(args.id);
};

const getDecks = async (parent, args) => {
	let result = await Deck.find({ _id: { $in: args.ids } });
	if (!result) {
		result = [];
	}
	return result;
};

const getDeck = async (parent, args) => {
	return await Deck.findById(args.id);
};

const node = async (parent, args) => {
	let result;
	result = await Deck.findById(args.id);
	if (!result) {
		result = await User.findById(args.id);
	}
	return result;
};

export const Query = {
	getUser,
	getDecks,
	getDeck,
	node
};
