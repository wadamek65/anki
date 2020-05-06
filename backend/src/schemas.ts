import * as mongoose from 'mongoose';

interface DocumentWithId extends mongoose.Document {
	id: string;
}

interface CardSchema extends DocumentWithId {
	language: {
		original: string;
		learning: string;
	};
	owner: string;
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
	owner: { type: String, required: true },
	word: { type: String, default: '' },
	translations: [String],
	note: { type: String, default: '' }
});

interface DeckSchema extends DocumentWithId {
	title: string;
	owner: string;
	createdAt: number;
	cards: mongoose.Schema.Types.ObjectId[];
}
const deckSchema = new mongoose.Schema({
	title: { type: String, default: '' },
	owner: { type: String, required: true },
	createdAt: Number,
	cards: [mongoose.Schema.Types.ObjectId]
});

interface SessionSchema extends DocumentWithId {
	startedAt: number;
	derivedDeckId: mongoose.Schema.Types.ObjectId;
	penalty: number;
	owner: string;
	questions: {
		cardId: mongoose.Schema.Types.ObjectId;
		word: string;
		translations: string[];
		note: string;
		from: string;
		to: string;
		correctAnswers: number;
		wrongAnswers: number;
		answersLeft: number;
	}[];
}

const sessionSchema = new mongoose.Schema({
	startedAt: Number,
	derivedDeckId: { type: mongoose.Schema.Types.ObjectId, required: true },
	penalty: Number,
	owner: { type: String, required: true },
	questions: [
		{
			cardId: { type: mongoose.Schema.Types.ObjectId, required: true },
			word: { type: String, default: '' },
			translations: [String],
			note: { type: String, default: '' },
			from: { type: String, default: '' },
			to: { type: String, default: '' },
			correctAnswers: { type: Number, default: 0 },
			wrongAnswers: { type: Number, default: 0 },
			answersLeft: { type: Number, default: 0 }
		}
	]
});

interface UserSchema extends DocumentWithId {
	name: string;
	avatar: string;
	email: string;
}

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	avatar: { type: String },
	email: { type: String, required: true }
});

export const User: mongoose.Model<UserSchema> = mongoose.models.user || mongoose.model('user', userSchema);
export const Deck: mongoose.Model<DeckSchema> = mongoose.models.deck || mongoose.model('deck', deckSchema);
export const Card: mongoose.Model<CardSchema> = mongoose.models.card || mongoose.model('card', cardSchema);
export const Session: mongoose.Model<SessionSchema> =
	mongoose.models.session || mongoose.model('session', sessionSchema);
