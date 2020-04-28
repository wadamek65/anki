import { Environment, FetchFunction, Network, RecordSource, Store } from 'relay-runtime';
import ky from 'ky';

import { API_URL } from './config';

const fetchRelay: FetchFunction = async (params, variables) => {
	const response = await ky.post(`${API_URL}/graphql`, {
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
