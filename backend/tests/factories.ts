import * as faker from 'faker';
import { Factory } from 'rosie';

export const LanguageFactory = new Factory()
  .attr('original', () => faker.address.country())
  .attr('learning', () => faker.address.country());

export const CardFactory = new Factory()
  .attr('language', () => LanguageFactory.build())
  .attr('word', () => faker.lorem.word())
  .attr('translations', () => faker.lorem.words().split(' '))
  .attr('note', () => faker.lorem.paragraph());

export const DeckFactory = new Factory()
  .attr('title', () => faker.lorem.sentence())
  .attr('cards', () => CardFactory.buildList(5));

export const UserFactory = new Factory()
  .attr('name', () => faker.name.firstName())
  .attr('decks', []);
