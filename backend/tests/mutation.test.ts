import * as chai from 'chai';
import * as faker from 'faker';
import { Deck, User } from '../src/schemas';
import { mutate } from './utils';

const expect = chai.expect;

describe('graphql mutation', () => {
	describe('createUser', () => {
		it('should create a user', async () => {
			const name = faker.name.firstName();
			const mutation = `
        mutation {
          createUser(input: {name: "${name}"}) {
            id
            name
          }
        }`;

			const result = await mutate({mutation});
			const user = await User.findById(result.data.createUser.id);

			expect(user.name).to.equal(name);
		})
	});

	describe('createDeck', () => {
		it('should create a deck', async () => {
			const title = faker.lorem.sentence();
			const mutation = `
        mutation {
          createDeck(input: {title: "${title}"}) {
            id
            title
          }
        }`;

			const result = await mutate({mutation});
			const deck = await Deck.findById(result.data.createDeck.id);

			expect(deck.title).to.equal(title);
		})
	});
});