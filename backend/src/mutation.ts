import { MutationResolvers } from './__generated__/resolvers';
import { AuthData } from './apollo';
import { Deck } from './schemas';

type Resolvers = MutationResolvers<AuthData>;

const createCard: Resolvers['createCard'] = async (parent, { deckId, card }, { email }) => {
	const deck = await Deck.findOne({ _id: deckId, owner: email });
	deck.cards.push(card ?? {});
	await deck.save();
	return deck.cards[deck.cards.length - 1];
};

const createDeck: Resolvers['createDeck'] = async (parent, { deckInput }, { email }) => {
	const title = deckInput?.title || '';
	return new Deck({ title, owner: email, createdAt: new Date().getTime() }).save();
};

const updateCard: Resolvers['updateCard'] = async (parent, { cardId, card: cardInput }, { email }) => {
	const deck = await Deck.findOne({ owner: email, 'cards._id': cardId });
	const card = deck.cards.id(cardId);
	card.note = cardInput.note;
	card.translations = cardInput.translations;
	card.word = cardInput.word;
	card.language = cardInput.language;
	await deck.save();
	return card;
};

export const Mutation: Resolvers = {
	createCard,
	createDeck,
	updateCard
};
