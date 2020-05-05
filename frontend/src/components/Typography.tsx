import styled, { css } from 'styled-components';

export const PageTitle = styled.header(
	({ theme }) => css`
		font-size: ${theme.font.size.title};
		font-style: italic;
		font-weight: ${theme.font.weight.medium};
		grid-column: 1 / -1;
	`
);
