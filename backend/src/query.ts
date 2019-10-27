import { Card, User } from './schemas';

const getUser = async (parent, args) => {
	return await User.findById(args.id);
};

const getCards = async (parent, args) => {
	let result = await Card.find({ _id: { $in: args.ids } });
	if (!result) {
		result = [];
	}
	return result;
};

const getCard = async (parent, args) => {
	return await Card.findById(args.id);
};

const node = async (parent, args) => {
	let result;
	result = await Card.findById(args.id);
	if (!result) {
		result = await User.findById(args.id);
	}
	return result;
};

export const Query = {
	getUser,
	getCards,
	getCard,
	node
};
