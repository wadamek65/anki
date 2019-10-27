import ky from 'ky';
import { Environment, GraphQLResponse, Network, RecordSource, Store } from 'relay-runtime';

const fetchQuery = (operation: any, variables: any) => ky.post('http://localhost:4000/graphql', {
	json: {
		query: operation.text,
		variables
	}
}).json<GraphQLResponse>();

export const environment = new Environment({
	network: Network.create(fetchQuery),
	store: new Store(new RecordSource())
});
