import { MutationResolvers } from './__generated__/resolvers';
import { AuthData } from './apollo';
import { Card, Deck } from './schemas';

type Resolvers = MutationResolvers<AuthData>;

const createCard: Resolvers['createCard'] = async (parent, { deckId, card }, { email }) => {
	const newCard = await new Card({ ...card, owner: email }).save();
	await Deck.updateOne({ _id: deckId, owner: email }, { $push: { cards: newCard.id } });
	return newCard;
};

const createDeck: Resolvers['createDeck'] = async (parent, { deckInput }, { email }) => {
	const title = deckInput?.title || '';
	return new Deck({ title, owner: email, createdAt: new Date().getTime() }).save();
};

const updateCard: Resolvers['updateCard'] = async (parent, { cardId, card }, { email }) => {
	return Card.updateOne({ _id: cardId, owner: email }, card);
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
