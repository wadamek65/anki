import ky, { BeforeRequestHook } from 'ky';
import { Environment, GraphQLResponse, Network, RecordSource, Store } from 'relay-runtime';

const addAuthHeader: BeforeRequestHook = (input, options) => {
	const clientId = localStorage.getItem('user');
	if (clientId) {
		options.headers.append('x-access-token', clientId);
	}
};

const client = ky.create({
	hooks: {
		beforeRequest: [addAuthHeader]
	}
});

const fetchQuery = (operation: any, variables: any) =>
	client
		.post('http://localhost:4000/graphql', {
			json: {
				query: operation.text,
				variables
			}
		})
		.json<GraphQLResponse>();

export const environment = new Environment({
	network: Network.create(fetchQuery),
	store: new Store(new RecordSource())
});
