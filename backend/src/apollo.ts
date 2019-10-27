import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { Mutation } from './mutation';
import { Query } from './query';

const resolvers = {
  Node: {
    __resolveType(obj, context, info){
      if (obj.cards !== undefined) {
        return 'Deck';
      }

      if (obj.name) {
        return 'User';
      }

      return null
    }
  },
  Query,
  Mutation
};
const typeDefs = importSchema('../schema.graphql');
export const server = new ApolloServer({typeDefs, resolvers});
