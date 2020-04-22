import * as React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ListItemPlaceholder } from '../../../components';
import { grid } from '../../../lib/styles';

export const Grid = styled.div(
	({ theme }) => css`
		${grid};
		grid-row-gap: ${theme.spacing.medium};
		padding-top: ${theme.spacing.veryLarge};
	`
);

export const StyledList = styled.ul`
	grid-column: 1 / -1;
`;

const ReturnLink = styled.div(
	({ theme }) => css`
		border-bottom: 0.5px solid ${theme.color.primary[0]};
		color: ${theme.color.primary[0]};
		cursor: pointer;
		grid-column: 1 / -1;
		justify-self: end;
	`
);

export const RouteContainer: React.FC = () => {
	return (
		<Grid>
			<ReturnLink>
				<Link to={'.'}>Return to deck list</Link>
			</ReturnLink>
			<Outlet />
		</Grid>
	);
};

export const ListPlaceholder: React.FC = () => {
	return (
		<StyledList>
			{[...Array(10)].map((_, index) => (
				<ListItemPlaceholder key={index} topRight={false} />
			))}
		</StyledList>
	);
};
