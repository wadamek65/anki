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

const cardSchema = new mongoose.Schema({
	language: {
		type: {
			original: String,
			learning: String
		},
		default: { original: '', learning: '' }
	},
	word: { type: String, default: '' },
	translations: [{ type: String }],
	note: { type: String, default: '' }
});

export interface DeckInterface extends mongoose.Document {
	title: string;
	owner: string;
	createdAd: number;
	cards: mongoose.Types.ObjectId[];
}

const deckSchema = new mongoose.Schema({
	title: { type: String, default: '' },
	owner: { type: String, required: true },
	createdAt: Number,
	cards: [{ type: cardSchema }]
});

export interface UserInterface extends mongoose.Document {
	name: string;
	email: string;
}

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true }
});

export const User = mongoose.models.user || mongoose.model('user', userSchema);
export const Deck = mongoose.models.deck || mongoose.model('deck', deckSchema);
