import graphql from "babel-plugin-relay/macro";
import { commitMutation as relayCommitMutation } from 'relay-runtime';
import { environment } from './relay';

export const createUser = graphql`
  mutation mutationsCreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      ok
    }
  }
`;

export const commitMutation = (mutation: any, input: Object) => relayCommitMutation(environment, {
  mutation,
  variables: {
    input
  }
});
