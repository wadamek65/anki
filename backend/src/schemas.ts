import * as mongoose  from 'mongoose';

const languageSchema = new mongoose.Schema({
  original: String,
  learning: String
});

const cardSchema = new mongoose.Schema({
  language: languageSchema,
  word: String,
  translations: [{type: String}],
  note: String
});

const deckSchema = new mongoose.Schema({
  title: String,
  cards: [{type: cardSchema}]
});

const userSchema = new mongoose.Schema({
  decks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Deck'}],
  name: {type: String, required: true}
});

export const User = mongoose.models.user || mongoose.model('user', userSchema);
export const Deck = mongoose.models.deck || mongoose.model('deck', deckSchema);
