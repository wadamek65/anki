import ky from 'ky';
import * as React from 'react';
import { GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useNavigate } from 'react-router';

import { API_URL, CLIENT_ID } from '../../lib/config';

export const Login: React.FC = () => {
	const navigate = useNavigate();

	const onSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline): Promise<void> => {
		const code = (response as GoogleLoginResponseOffline).code;
		await ky.post(`${API_URL}/api/login`, { credentials: 'include', headers: { 'google-code': code } });
		//	TODO: handle error
		navigate('/');
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
