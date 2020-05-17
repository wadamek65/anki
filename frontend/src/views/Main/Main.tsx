import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { REFRESH_TOKEN_KEY } from '../Login';
import { MobileNavbar } from './components/Navbar';
import { CLIENT_ID } from '../../lib/config';

export const Main: React.FC = () => {
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

	if (refreshToken === null && CLIENT_ID !== '') {
		return <Navigate to="/login" />;
	}

	return (
		<ErrorBoundary>
			<MobileNavbar />
			<React.Suspense fallback={<div>Loading ...</div>}>
				<Outlet />
			</React.Suspense>
		</ErrorBoundary>
	);
};
