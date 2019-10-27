import { createTestClient } from 'apollo-server-testing';
import { server } from '../src/apollo';

export const { query, mutate } = createTestClient(server);
