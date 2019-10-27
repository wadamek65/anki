import * as React from 'react';
import { commitMutation, createUser } from '../lib/mutations';

export const Decks = () => {
  return <button onClick={() => commitMutation(createUser, {name: 'wadamek-2'})}>CREATE WADAMEK</button>
};
