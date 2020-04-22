import * as React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

const TOKEN_KEY = 'access-token';
const CLIENT_ID = '561207995036-g3g2jjd7af267q2q7vfb8tdqhahkn0f8.apps.googleusercontent.com';

export const Auth: React.FC = ({ children }) => {
	const token = localStorage.getItem(TOKEN_KEY);

	const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(token !== null);

	const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
		setIsAuthenticated(true);
		localStorage.setItem(TOKEN_KEY, (response as GoogleLoginResponse).accessToken);
	};

	const onFailure = (): void => localStorage.removeItem(TOKEN_KEY);

	if (!isAuthenticated) {
		return <GoogleLogin clientId={CLIENT_ID} onFailure={onFailure} onSuccess={onSuccess} />;
	}

	return children as any;
};
