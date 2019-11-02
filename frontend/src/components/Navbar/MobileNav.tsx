import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import * as React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
	align-items: center;
	background-color: ${props => props.theme.color.primary.dark};
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px fit-content(1px) fit-content(40px) fit-content(40px) fit-content(40px) fit-content(40px);
	min-height: ${props => props.theme.navHeight};
	padding: 0 16px;
`;

const ExpandButton = styled.button`
	justify-self: end;
	width: fit-content;
	
	svg {
		color: ${props => props.theme.color.primary.contrast};
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

const NavLink = ({ to, label, onClick }: { to: string, label: string, onClick?: () => void }) => {
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

export const MobileNav = () => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	return <Nav>
		<ExpandButton onClick={() => setIsExpanded(prev => !prev)}>
			<FontAwesomeIcon icon={faBars}/>
		</ExpandButton>
		{isExpanded &&
		<>
			<Divider/>
			<NavLink to={'/'} label={'Home'} onClick={() => setIsExpanded(false)}/>
			<NavLink to={'/decks'} label={'Decks'} onClick={() => setIsExpanded(false)}/>
			<NavLink to={'/study'} label={'Study'} onClick={() => setIsExpanded(false)}/>
			<NavLink to={'/sessions'} label={'Sessions'} onClick={() => setIsExpanded(false)}/>
		</>
		}
	</Nav>;
};
