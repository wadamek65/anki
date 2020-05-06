import { MutationResolvers, Question, StudyDirection } from './__generated__/resolvers';
import { AuthData } from './apollo';
import { Card, Deck, Session } from './schemas';

type Resolvers = MutationResolvers<AuthData>;

const createCard: Resolvers['createCard'] = async (parent, { input }, { email }) => {
	const { deckId, ...card } = input;
	const newCard = await new Card({ ...card, owner: email }).save();
	await Deck.updateOne({ _id: deckId, owner: email }, { $push: { cards: newCard._id } });
	return { card: newCard };
};

const createDeck: Resolvers['createDeck'] = async (parent, { input }, { email }) => {
	const title = input?.title || '';
	const deck = await new Deck({ title, owner: email, createdAt: new Date().getTime() }).save();
	// TODO: figure out how to make the return value work with typescript and nested resolvers
	return { deck } as any;
};

const updateCard: Resolvers['updateCard'] = async (parent, { input }, { email }) => {
	const { cardId, ...card } = input;
	const updatedCard = await Card.findOneAndUpdate({ _id: cardId, owner: email }, card);
	// TODO: handle not found
	return { card: updatedCard } as any;
};

const startStudySession: Resolvers['startStudySession'] = async (parent, { input }, { email }) => {
	const { deckId, direction, penalty, repeatNumber } = input;

	const deck = await Deck.findOne({ _id: deckId, owner: email });
	// TODO: handle deck not found properly
	const cards = await Card.find({ _id: { $in: (deck as any).cards } });

	const getQuestion = (card: any): Question[] => {
		const baseCard = {
			note: card.note,
			cardId: card.id,
			correctAnswers: 0,
			wrongAnswers: 0,
			answersLeft: repeatNumber
		};

		const questions = [];

		if (direction === StudyDirection.Standard || direction === StudyDirection.Both) {
			questions.push({
				...baseCard,
				word: card.word,
				translations: card.translations,
				from: card.language.original,
				to: card.language.learning
			});
		}

		if (direction === StudyDirection.Reversed || direction === StudyDirection.Both) {
			questions.push({
				...baseCard,
				word: card.translations[0],
				translations: [card.word],
				to: card.language.original,
				from: card.language.learning
			});
		}

		return questions;
	};

	const session = await new Session({
		startedAt: new Date().getTime(),
		derivedDeckId: deckId,
		penalty,
		owner: email,
		questions: cards.flatMap(getQuestion)
	}).save();

	return { session } as any;
};

export const Mutation: Resolvers = {
	createCard,
	createDeck,
	updateCard,
	startStudySession
};
