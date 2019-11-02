import { Router } from '@reach/router';
import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { MobileNav } from '../components/Navbar/MobileNav';
import { UserInfoQuery } from './__generated__/UserInfoQuery.graphql';
import { Decks } from './Decks';

export const UserInfo = () => {
	const data = useLazyLoadQuery<UserInfoQuery>(
		graphql`
			query UserInfoQuery {
				user {
					email

					...MobileNav_user
				}
			}
		`,
		{},
		{ fetchPolicy: 'network-only' }
	);

	return (
		<>
			<MobileNav user={data.user as any} />
			<Router>
				<Decks path={'/'} />
			</Router>
		</>
	);
};
