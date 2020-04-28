import { MutationResolvers } from './__generated__/resolvers';
import { AuthData } from './apollo';
import { Card, Deck } from './schemas';

type Resolvers = MutationResolvers<AuthData>;

const createCard: Resolvers['createCard'] = async (parent, { input }, { email }) => {
	const { deckId, ...card } = input;
	const newCard = await new Card({ ...card, owner: email }).save();
	await Deck.updateOne({ _id: deckId, owner: email }, { $push: { cards: newCard.id } });
	return { card: newCard };
};

const createDeck: Resolvers['createDeck'] = async (parent, { input }, { email }) => {
	const title = input?.title || '';
	const deck = await new Deck({ title, owner: email, createdAt: new Date().getTime() }).save();
	return { deck };
};

const updateCard: Resolvers['updateCard'] = async (parent, { input }, { email }) => {
	const { cardId, ...card } = input;
	const updatedCard = await Card.findOneAndUpdate({ _id: cardId, owner: email }, card);
	return { card: updatedCard };
};

// const startStudySession: Resolvers['startStudySession'] = async (parent, { deckId, sessionOptions }) => {
//
//
// };

export const Mutation: Resolvers = {
	createCard,
	createDeck,
	updateCard
	// startStudySession
};
