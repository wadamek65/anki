import { AuthData } from './apollo';
import { Card, Deck, User as DBUser, User } from './schemas';

const user = async (_parent, _args, { name, email, picture }: AuthData) => {
	const userInfo = await DBUser.findOne({ email });
	if (!userInfo) {
		await new DBUser({ email, name }).save();
	}

	return { ...userInfo.toObject(), avatar: picture };
};

const node = async (_parent, { id }: { id: string }) => {
	let result;
	result = await Card.findById(id);
	if (!result) {
		result = await User.findById(id);
	}
	if (!result) {
		result = await Deck.findById(id);
	}
	return result;
};

export const Query = {
	node,
	user
};
