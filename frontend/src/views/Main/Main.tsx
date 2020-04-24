import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { MobileNav } from './components/Nav';

export const Main: React.FC = () => {
	return (
		<>
			<MobileNav />
			<Outlet />
		</>
	);
};
