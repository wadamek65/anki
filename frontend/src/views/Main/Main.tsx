import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { MobileNavbar } from './components/Navbar';

export const Main: React.FC = () => {
	return (
		<>
			<MobileNavbar />
			<Outlet />
		</>
	);
};
