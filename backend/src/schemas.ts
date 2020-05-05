import * as mongoose from 'mongoose';

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

const deckSchema = new mongoose.Schema({
	title: { type: String, default: '' },
	owner: { type: String, required: true },
	createdAt: Number,
	cards: [mongoose.Schema.Types.ObjectId]
});

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

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	avatar: { type: String },
	email: { type: String, required: true }
});

export const User = mongoose.models.user || mongoose.model('user', userSchema);
export const Deck = mongoose.models.deck || mongoose.model('deck', deckSchema);
export const Card = mongoose.models.card || mongoose.model('card', cardSchema);
export const Session = mongoose.models.session || mongoose.model('session', sessionSchema);
