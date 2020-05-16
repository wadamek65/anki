import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { MobileNavbarGetUserQuery } from './__generated__/MobileNavbarGetUserQuery.graphql';
import { NavbarElements } from './elements';

const UserDataFallback: React.FC = () => (
	<>
		<NavbarElements.AvatarPlaceholder />
		<NavbarElements.NamePlaceholder />
	</>
);

const UserData: React.FC = () => {
	const data = useLazyLoadQuery<MobileNavbarGetUserQuery>(
		graphql`
			query MobileNavbarGetUserQuery {
				user {
					avatar
					name
				}
			}
		`,
		{}
	);

	return (
		<>
			{<NavbarElements.Avatar src={data.user.avatar} alt={'User Avatar'} />}
			{data.user.name}
		</>
	);
};

export const MobileNavbar: React.FC = () => {
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
	const [startTransition] = React.useTransition({ timeoutMs: 500 });

	const hideDropdown = (): void => setIsExpanded(false);

	const onNavigate = (to: string) => {
		hideDropdown();
		startTransition(() => {
			navigate(to);
		});
	};

	return (
		<NavbarElements.Container>
			<NavbarElements.Head>
				<NavbarElements.AvatarWithName>
					{/* TODO: Add error boundary*/}
					<React.Suspense fallback={<UserDataFallback />}>
						<UserData />
					</React.Suspense>
				</NavbarElements.AvatarWithName>
				<NavbarElements.ExpandButton onClick={() => setIsExpanded(prev => !prev)}>
					<FontAwesomeIcon icon={faBars} />
				</NavbarElements.ExpandButton>
			</NavbarElements.Head>
			{isExpanded && (
				<>
					<NavbarElements.Divider />
					<NavbarElements.StyledLink isActive={false} onClick={() => onNavigate('/decks')}>
						Decks
					</NavbarElements.StyledLink>
					<NavbarElements.StyledLink isActive={false} onClick={() => onNavigate('/')}>
						Sessions
					</NavbarElements.StyledLink>
					<NavbarElements.StyledLink isActive={false} onClick={() => onNavigate('/profile')}>
						Profile
					</NavbarElements.StyledLink>
				</>
			)}
		</NavbarElements.Container>
	);
};
