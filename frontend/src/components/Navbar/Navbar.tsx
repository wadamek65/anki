import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { NavbarQuery } from './__generated__/NavbarQuery.graphql';
import { MobileNav } from './MobileNav';

const NavbarData = () => {
	const data = useLazyLoadQuery<NavbarQuery>(
		graphql`
			query NavbarQuery {
				user {
					email

					...MobileNav_user
				}
			}
		`,
		{}
	);

	return (
		<MobileNav user={data.user as any}/>
	);
};

export const Navbar = () =>
	<React.Suspense fallback={<h1>Loading ...</h1>}>
		<NavbarData />
	</React.Suspense>;
