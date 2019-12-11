import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { preloadQuery, usePreloadedQuery } from 'react-relay/hooks';

import { environment } from '../../lib/relay';
import { NavbarQuery } from './__generated__/NavbarQuery.graphql';
import { MobileNavTemplate } from './MobileNav';

const query = graphql`
	query NavbarQuery {
		user {
			email
			name
			avatar
		}
	}
`;
const result = preloadQuery<NavbarQuery>(environment, query, {});

const NavbarData = () => {
	const data = usePreloadedQuery<NavbarQuery>(query, result);

	return <MobileNavTemplate name={data.user.name} avatar={data.user.avatar ? data.user.avatar : undefined} />;
};

export const Navbar = () => (
	<React.Suspense fallback={<MobileNavTemplate />}>
		<NavbarData />
	</React.Suspense>
);
