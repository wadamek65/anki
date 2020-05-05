import * as React from 'react';
import styled, { css } from 'styled-components';

import { List } from '../../../components';
import { grid } from '../../../lib/styles';

export const Grid = styled.div(
	({ theme }) => css`
		${grid};
		grid-row-gap: ${theme.spacing.medium};
		padding-top: ${theme.spacing.veryLarge};
	`
);

export const GridSpan = styled.ul`
	grid-column: 1 / -1;
`;

export const ReturnLink = styled.a(
	({ theme }) => css`
		border-bottom: 0.5px solid ${theme.color.primary[0]};
		color: ${theme.color.primary[0]};
		cursor: pointer;
		grid-column: 1 / -1;
		justify-self: end;
	`
);

export const ListPlaceholder: React.FC = () => {
	return (
		<GridSpan>
			{[...Array(10)].map((_, index) => (
				<List.ItemPlaceholder key={index} topRight={false} />
			))}
		</GridSpan>
	);
};
