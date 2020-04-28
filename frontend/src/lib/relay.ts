import { Environment, FetchFunction, Network, RecordSource, Store } from 'relay-runtime';
import ky from 'ky';

const fetchRelay: FetchFunction = async (params, variables) => {
	const response = await ky.post('http://localhost:4000/graphql', {
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		json: {
			query: params.text,
			variables
		}
	});
	return await response.json();
};

export const relayEnvironment = new Environment({
	network: Network.create(fetchRelay),
	store: new Store(new RecordSource())
});
