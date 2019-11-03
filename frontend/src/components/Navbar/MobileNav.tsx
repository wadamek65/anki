import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import * as React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
	background-color: ${props => props.theme.color.primary.dark};
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px fit-content(1px) fit-content(40px) fit-content(40px) fit-content(40px);
	min-height: ${props => props.theme.navHeight};
	padding: 0 16px;
`;

const Header = styled.title`
	align-items: center;
	color: ${props => props.theme.color.primary.contrast};
	display: flex;
	justify-content: space-between;
`;

const Avatar = styled.img`
	background-color: ${({ theme }) => theme.color.gray.disabled};
	border-radius: 50%;
	height: 24px;
	margin-right: ${({ theme }) => theme.spacing.small};
	width: 24px;
`;

const AvatarTemplate = styled.span`
	background-color: ${({ theme }) => theme.color.gray.light};
	border-radius: 50%;
	height: 24px;
	margin-right: ${({ theme }) => theme.spacing.small};
	width: 24px;
`;

const NameTemplate = styled.span`
	background-color: ${({ theme }) => theme.color.gray.light};
	border-radius: 7%;
	height: 12px;
	width: 120px;
`;

const AvatarWithName = styled.span`
	align-items: center;
	display: flex;
`;

const ExpandButton = styled.button`
	width: fit-content;

	svg {
		font-size: 24px;
	}
`;

const Divider = styled.hr`
	border-top: 1px solid ${props => props.theme.color.primary.contrast};
	height: 0;
	width: 100%;
`;

const StyledLink = styled.div<{ isActive: boolean }>`
	${({ theme, isActive }) => `
		align-items: center;
		background-color: ${isActive ? theme.color.primary.neutral : ''};
		border-radius: 5px;
		color: ${theme.color.primary.contrast};
		display: flex;
		font-size: 18px;
		font-weight: ${theme.font.weight.semiBold};
		height: 32px;
		margin: 8px 0;
		padding-left: 16px;
		width: auto;
	`}
`;

const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => {
	const [isActive, setIsActive] = React.useState(false);

	const getCurrent = ({ isCurrent }: { isCurrent: boolean }) => {
		setIsActive(isCurrent);
		return {};
	};

	return (
		<Link getProps={getCurrent} to={to}>
			<StyledLink isActive={isActive} onClick={onClick}>
				{label}
			</StyledLink>
		</Link>
	);
};

export const MobileNavTemplate = ({ name, avatar }: { name?: string; avatar?: string }) => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	return (
		<Nav>
			<Header>
				<AvatarWithName>
					{avatar !== undefined ? <Avatar src={avatar} alt={'User Avatar'} /> : <AvatarTemplate />}
					{name !== undefined ? name : <NameTemplate />}
				</AvatarWithName>
				<ExpandButton onClick={() => setIsExpanded(prev => !prev)}>
					<FontAwesomeIcon icon={faBars} />
				</ExpandButton>
			</Header>
			{isExpanded && (
				<>
					<Divider />
					<NavLink to={'/'} label={'Decks'} onClick={() => setIsExpanded(false)} />
					<NavLink to={'/study'} label={'Study'} onClick={() => setIsExpanded(false)} />
					<NavLink to={'/sessions'} label={'Sessions'} onClick={() => setIsExpanded(false)} />
				</>
			)}
		</Nav>
	);
};
