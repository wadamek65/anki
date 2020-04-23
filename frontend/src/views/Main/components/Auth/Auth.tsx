import * as React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { AUTH_ENABLED, CLIENT_ID } from '../../../../lib/config';

export const TOKEN_KEY = 'access-token';

export const Auth: React.FC = ({ children }) => {
	const token = localStorage.getItem(TOKEN_KEY);

	const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(token !== null);

	const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
		localStorage.setItem(TOKEN_KEY, (response as GoogleLoginResponse).tokenId);
		setIsAuthenticated(true);
	};

	const onFailure = (): void => localStorage.removeItem(TOKEN_KEY);
	if (!isAuthenticated && AUTH_ENABLED) {
		return <GoogleLogin clientId={CLIENT_ID} onFailure={onFailure} onSuccess={onSuccess} />;
	}

	return children as any;
};
