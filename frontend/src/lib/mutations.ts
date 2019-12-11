import graphql from 'babel-plugin-relay/macro';

export const createDeck = graphql`
	mutation mutationsCreateDeckMutation($input: CreateDeckInput!) {
		createDeck(input: $input) {
			id
			title
		}
	}
`;
