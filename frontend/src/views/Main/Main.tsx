import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { REFRESH_TOKEN_KEY } from '../Login';
import { MobileNavbar } from './components/Navbar';

export const Main: React.FC = () => {
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

	if (refreshToken === null) {
		return <Navigate to="/login" />;
	}

	return (
		<ErrorBoundary>
			<MobileNavbar />
			<Outlet />
		</ErrorBoundary>
	);
};
