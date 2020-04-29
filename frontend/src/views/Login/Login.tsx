import ky from 'ky';
import * as React from 'react';
import { GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useNavigate } from 'react-router';

import { CLIENT_ID } from '../../lib/config';

export const REFRESH_TOKEN_KEY = 'refreshToken';

export const Login: React.FC = () => {
	const navigate = useNavigate();

	const onSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline): Promise<void> => {
		const code = (response as GoogleLoginResponseOffline).code;
		const res = await ky.post('/api/login', { credentials: 'include', headers: { 'google-code': code } });
		const data = await res.json();
		localStorage.setItem(REFRESH_TOKEN_KEY, data[REFRESH_TOKEN_KEY]);
		navigate('/decks');
	};

	const onFailure = (error: any): void => console.error(error);

	return (
		<>
			<GoogleLogin
				responseType="code"
				accessType="offline"
				clientId={CLIENT_ID}
				onFailure={onFailure}
				onSuccess={onSuccess}
			/>
			<GoogleLogout clientId={CLIENT_ID} />
		</>
	);
};
