import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { useGetUserQuery } from '../../../../__generated__/graphql';

const Nav = styled.nav(
	({ theme }) => css`
		background-color: ${theme.color.primary[0]};
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 50px fit-content(1px) fit-content(40px) fit-content(40px) fit-content(40px);
		min-height: ${theme.navHeight};
		padding: 0 16px;
	`
);

const Header = styled.title(
	({ theme }) => css`
		align-items: center;
		color: ${theme.color.primary[4]};
		display: flex;
		justify-content: space-between;
	`
);

const Avatar = styled.img(
	({ theme }) => css`
		border-radius: 50%;
		height: 24px;
		margin-right: ${theme.spacing.small};
		width: 24px;
	`
);

const AvatarPlaceholder = styled.span(
	({ theme }) => css`
		background-color: ${theme.color.gray[4]};
		border-radius: 50%;
		height: 24px;
		margin-right: ${theme.spacing.small};
		width: 24px;
	`
);

const NamePlaceholder = styled.span(
	({ theme }) => css`
		background-color: ${theme.color.gray[4]};
		border-radius: 7%;
		height: 12px;
		width: 120px;
	`
);

const AvatarWithName = styled.span`
	align-items: center;
	display: flex;
`;

const ExpandButton = styled.button`
	cursor: pointer;
	width: fit-content;

	svg {
		font-size: 24px;
	}
`;

const Divider = styled.hr(
	({ theme }) => css`
		border-top: 1px solid ${theme.color.primary[4]};
		height: 0;
		width: 100%;
	`
);

const StyledLink = styled.div<{ isActive: boolean }>(
	({ theme, isActive }) => css`
		align-items: center;
		background-color: ${isActive ? theme.color.primary[2] : ''};
		border-radius: 5px;
		color: ${theme.color.primary[4]};
		cursor: pointer;
		display: flex;
		font-size: 18px;
		font-weight: ${theme.font.weight.semiBold};
		height: 32px;
		margin: 8px 0;
		padding-left: 16px;
		width: auto;
	`
);

interface NavLinkProps {
	to: string;
	label: string;
	onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, onClick }) => {
	const [isActive] = React.useState(false);

	return (
		<Link to={to}>
			<StyledLink isActive={isActive} onClick={onClick}>
				{label}
			</StyledLink>
		</Link>
	);
};

export const MobileNav: React.FC = () => {
	const [isExpanded, setIsExpanded] = React.useState(false);
	const { data } = useGetUserQuery();

	const avatar = data?.user?.avatar;
	const name = data?.user?.name;

	const hideDropdown = (): void => setIsExpanded(false);

	return (
		<Nav>
			<Header>
				<AvatarWithName>
					{avatar !== undefined ? <Avatar src={avatar} alt={'User Avatar'} /> : <AvatarPlaceholder />}
					{name !== undefined ? name : <NamePlaceholder />}
				</AvatarWithName>
				<ExpandButton onClick={() => setIsExpanded(prev => !prev)}>
					<FontAwesomeIcon icon={faBars} />
				</ExpandButton>
			</Header>
			{isExpanded && (
				<>
					<Divider />
					<NavLink to={'/decks'} label={'Decks'} onClick={hideDropdown} />
					<NavLink to={'/sessions'} label={'Sessions'} onClick={hideDropdown} />
				</>
			)}
		</Nav>
	);
};
