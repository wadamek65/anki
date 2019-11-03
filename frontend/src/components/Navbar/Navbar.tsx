import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { NavbarQuery } from './__generated__/NavbarQuery.graphql';
import { MobileNavTemplate } from './MobileNav';

const NavbarData = () => {
	const data = useLazyLoadQuery<NavbarQuery>(
		graphql`
			query NavbarQuery {
				user {
					email
					name
					avatar
				}
			}
		`,
		{}
	);

	return <MobileNavTemplate name={data.user.name} avatar={data.user.avatar ? data.user.avatar : undefined} />;
};

export const Navbar = () => (
	<React.Suspense fallback={<MobileNavTemplate />}>
		<NavbarData />
	</React.Suspense>
);
