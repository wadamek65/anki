import { MutationResolvers, Question, StudyDirection } from './__generated__/resolvers';
import { Card, Deck, Session, UserSchema } from './schemas';

type Resolvers = MutationResolvers<UserSchema>;

const createCard: Resolvers['createCard'] = async (parent, { input }, { email }) => {
	const { deckId, ...card } = input;
	const newCard = await new Card({ ...card, owner: email }).save();
	await Deck.updateOne({ _id: deckId, owner: email }, { $push: { cards: newCard._id } });
	return { card: newCard } as any;
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
				from: card.language.learning,
				to: card.language.original
			});
		}

		if (direction === StudyDirection.Reversed || direction === StudyDirection.Both) {
			questions.push({
				...baseCard,
				word: card.translations[0],
				translations: [card.word],
				to: card.language.learning,
				from: card.language.original
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

const addLanguage: Resolvers['addLanguage'] = async (parent, { input: { name, color } }, user) => {
	const newLanguage = user.appSettings.languages.create({ name, color });
	user.appSettings.languages.push(newLanguage);
	await user.save();
	return { language: newLanguage };
};

const updateLanguage: Resolvers['updateLanguage'] = async (parent, { input }, user) => {
	const language = user.appSettings.languages.id(input.id);
	language.name = input.name;
	language.color = input.color;
	await user.save();
	return { language };
};

const removeLanguage: Resolvers['removeLanguage'] = async (parent, { input: { languageId } }, user) => {
	user.appSettings.languages.pull(languageId);
	await user.save();
	return { languageId };
};

export const Mutation: Resolvers = {
	addLanguage,
	createCard,
	createDeck,
	updateCard,
	updateLanguage,
	removeLanguage,
	startStudySession
};
