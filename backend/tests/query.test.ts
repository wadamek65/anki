import * as chai from 'chai';
import { Deck, User } from '../src/schemas';
import { DeckFactory, UserFactory } from './factories';
import { query } from './utils';

const expect = chai.expect;

describe('graphql query', () => {
	describe('getUser', () => {
		it('should return a user', async () => {
			const user = UserFactory.build();
			const dbUser = await new User(user).save();

			const result = await query({
				query: `{ getUser(id:"${dbUser.id}") { id name }}`
			});

			expect(result.data.getUser.id).to.equal(dbUser.id);
			expect(result.data.getUser.name).to.equal(dbUser.name);
		});
	});

	describe('getDeck', () => {
		it('should return a deck', async () => {
			const deck = DeckFactory.build();
			const dbDeck = await new Deck(deck).save();

			const result = await query({
				query: `{ 
          getDeck(id:"${dbDeck.id}") { 
            id 
            title 
            cards { 
              word 
              translations 
              note 
              language {
                original
                learning
              }
            }
          }
        }`
			});

			const data = result.data.getDeck;
			expect(data.id).to.equal(dbDeck.id);
			expect(data.title).to.equal(dbDeck.title);
			expect(data.cards).to.deep.equal(deck.cards);
		});
	});

	describe('getDecks', () => {
		it('should return an empty array', async () => {
			const result = await query({ query: `{ getDecks(ids:[]) { id }}` });
			expect(result.data.getDecks.length).to.equal(0);
		});

		it('should return decks', async () => {
			const decks = DeckFactory.buildList(3);
			const dbDecks = [];
			for (const d of decks) {
				dbDecks.push(await new Deck(d).save());
			}

			const getDecksQuery = `{ 
          getDecks(ids:["${dbDecks[0].id}", "${dbDecks[1].id}", "${dbDecks[2].id}"]) { 
            id 
            title 
            cards { 
              word 
              translations 
              note 
              language {
                original
                learning
              }
            }
          }
        }`;

			const result = await query({ query: getDecksQuery });
			const data = result.data.getDecks;

			expect(data.length).to.equal(3);
			for (let i = 0; i < 3; i++) {
				expect(data[i].id).to.equal(dbDecks[i].id);
				expect(data[i].title).to.equal(dbDecks[i].title);
				expect(data[i].cards).to.deep.equal(decks[i].cards);
			}
		});
	});

	describe('node', () => {
		const user = UserFactory.build();
		const deck = DeckFactory.build();
		let dbUser;
		let dbDeck;

		before(async () => {
			dbUser = await new User(user).save();
			dbDeck = await new Deck(deck).save();
		});

		const graphQuery = (id: string) => `{
      node(id:"${id}") {
        id
        ...on User {
          name
        }
        ...on Deck {
          title
          cards {
            word
            note
            translations
            language {
              original
              learning
            }
          }
        }
      }
    }`;

		it('should return user', async () => {
			const result = await query({
				query: graphQuery(dbUser.id)
			});

			expect(result.data.node.id).to.equal(dbUser.id);
			expect(result.data.node.name).to.equal(dbUser.name);
		});

		it('should return deck', async () => {
			const result = await query({
				query: graphQuery(dbDeck.id)
			});

			expect(result.data.node.id).to.equal(dbDeck.id);
			expect(result.data.node.title).to.equal(deck.title);
			expect(result.data.node.cards).to.deep.equal(deck.cards);
		});
	});
});
