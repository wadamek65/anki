import * as chai from 'chai';
import * as faker from 'faker';
import { Card, User } from '../src/schemas';
import { mutate } from './utils';

const expect = chai.expect;

describe('graphql mutation', () => {
	describe('createUser', () => {
		it('should create a user', async () => {
			const name = faker.name.firstName();
			const mutation = `
        mutation CreateUser($name: String!) {
          createUser(input: {name: $name}) {
            id
            name
          }
        }`;

			const result = await mutate({ mutation, variables: { name } });
			const user = await User.findById(result.data.createUser.id);

			expect(user.name).to.equal(name);
		});
	});

	describe('createCard', () => {
		it('should create a card', async () => {
			const word = faker.lorem.word();
			const mutation = `
        mutation CreateCard($word: String) {
          createCard(input: {word: $word}) {
            id
            word
          }
        }`;

			const result = await mutate({ mutation, variables: { word } });
			const card = await Card.findById(result.data.createCard.id);

			expect(card.word).to.equal(word);
		});
	});
});
