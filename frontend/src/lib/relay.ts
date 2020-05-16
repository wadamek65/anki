import { Environment, RecordSource, Store } from 'relay-runtime';
import { RelayNetworkLayer, authMiddleware, cacheMiddleware } from 'react-relay-network-modern';
import ky from 'ky';

import { REFRESH_TOKEN_KEY } from '../views/Login';

export const relayEnvironment = new Environment({
	network: new RelayNetworkLayer([
		cacheMiddleware(),
		authMiddleware({
			allowEmptyToken: true,
			tokenRefreshPromise: async () => {
				try {
					const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || '';
					await ky.post('/api/login/refresh', { headers: { 'refresh-token': refreshToken } });
				} catch {
					localStorage.removeItem(REFRESH_TOKEN_KEY);
				}
				return '';
			}
		})
	]),
	store: new Store(new RecordSource())
});
