import { Card, User } from './schemas';

const user = async (parent, args, { email, name, picture }) => {
	let userInfo = await User.findOne({ email });
	if (!userInfo) {
		userInfo = await new User({ email, name }).save();
	}
	return { name: userInfo.name, email: userInfo.email, avatar: picture };
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
	user,
	node
};
