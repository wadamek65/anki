import * as chai from 'chai';
import { Card, User } from '../src/schemas';
import { CardFactory, UserFactory } from './factories';
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

	describe('getCard', () => {
		it('should return a card', async () => {
			const card = CardFactory.build();
			const dbCard = await new Card(card).save();

			const result = await query({
				query: `{ 
          getCard(id:"${dbCard.id}") { 
            id 
						word 
						translations 
						note 
						language {
							original
							learning
						}
          }
        }`
			});

			const data = result.data.getCard;
			expect(data.id).to.equal(dbCard.id);
			expect(data.word).to.equal(dbCard.word);
			expect(data.note).to.equal(dbCard.note);
			expect(data.translations).to.deep.equal(dbCard.translations);
			expect(data.language).to.deep.equal(card.language);
		});
	});

	describe('getCards', () => {
		it('should return an empty array', async () => {
			const result = await query({ query: `{ getCards(ids:[]) { id }}` });
			expect(result.data.getCards.length).to.equal(0);
		});

		it('should return cards', async () => {
			const cards = CardFactory.buildList(3);
			const dbCards = [];
			for (const d of cards) {
				dbCards.push(await new Card(d).save());
			}

			const getCardsQuery = `{ 
				getCards(ids:["${dbCards[0].id}", "${dbCards[1].id}", "${dbCards[2].id}"]) { 
					id
					word 
					translations 
					note 
					language {
						original
						learning
					}
				}
			}`;

			const result = await query({ query: getCardsQuery });
			const data = result.data.getCards;

			expect(data.length).to.equal(3);
			for (let i = 0; i < 3; i++) {
				expect(data[i].id).to.equal(dbCards[i].id);
				expect(data[i].word).to.equal(dbCards[i].word);
				expect(data[i].note).to.equal(dbCards[i].note);
				expect(data[i].languages).to.deep.equal(dbCards[i].languages);
				expect(data[i].translations).to.deep.equal(dbCards[i].translations);
			}
		});
	});

	describe('node', () => {
		const user = UserFactory.build();
		const card = CardFactory.build();
		let dbUser;
		let dbCard;

		before(async () => {
			dbUser = await new User(user).save();
			dbCard = await new Card(card).save();
		});

		const graphQuery = (id: string) => `{
      node(id:"${id}") {
        id
        ...on User {
          name
        }
        ...on Card {
					word
					note
					translations
					language {
						original
						learning
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

		it('should return card', async () => {
			const result = await query({
				query: graphQuery(dbCard.id)
			});

			expect(result.data.node.id).to.equal(dbCard.id);
			expect(result.data.node.word).to.equal(card.word);
			expect(result.data.node.note).to.equal(card.note);
			expect(result.data.node.languages).to.deep.equal(card.languages);
			expect(result.data.node.translations).to.deep.equal(card.translations);
		});
	});
});
