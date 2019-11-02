import * as React from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';

export class ErrorBoundary extends React.Component {
	state = {
		error: undefined,
		isLoggedIn: true
	};

	static getDerivedStateFromError(error: any) {
		return { error, isLoggedIn: false };
	}

	render() {
		if (this.state.isLoggedIn) {
			return this.props.children;
		}

		return (
			<GoogleLogin
				clientId={'561207995036-g3g2jjd7af267q2q7vfb8tdqhahkn0f8.apps.googleusercontent.com'}
				onFailure={() => {
					this.setState({ isLoggedIn: false });
				}}
				onSuccess={response => {
					localStorage.setItem('user', (response as GoogleLoginResponse).tokenId);
					this.setState({ isLoggedIn: true });
				}}
			/>
		);
	}
}
