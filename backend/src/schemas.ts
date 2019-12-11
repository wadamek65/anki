import * as mongoose from 'mongoose';

export interface CardInterface extends mongoose.Document {
	language: {
		original: string;
		learning: string;
	};
	word: string;
	translations: string[];
	note: string;
}

const languageSchema = new mongoose.Schema({
	original: String,
	learning: String
});

const cardSchema = new mongoose.Schema({
	language: languageSchema,
	word: String,
	translations: [{ type: String }],
	note: String
});

export interface DeckInterface extends mongoose.Document {
	title: string;
	owner: string;
	cards: mongoose.Types.ObjectId[];
}

const deckSchema = new mongoose.Schema({
	title: String,
	owner: { type: String, required: true },
	cards: [{ type: mongoose.Types.ObjectId, ref: 'Card' }]
});

export interface UserInterface extends mongoose.Document {
	name: string;
	email: string;
}

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true }
});

export const User: mongoose.Model<UserInterface> = mongoose.models.user || mongoose.model('user', userSchema);
export const Deck: mongoose.Model<DeckInterface> = mongoose.models.deck || mongoose.model('deck', deckSchema);
export const Card: mongoose.Model<CardInterface> = mongoose.models.card || mongoose.model('card', cardSchema);
