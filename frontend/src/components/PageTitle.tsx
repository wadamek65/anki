import * as React from 'react';
import styled, { css } from 'styled-components';

const Title = styled.header(
	({ theme }) => css`
		font-size: ${theme.font.size.title};
		font-style: italic;
		font-weight: ${theme.font.weight.medium};
		grid-column: 1 / -1;
	`
);

export const PageTitle: React.FC = ({ children }) => <Title>{children}</Title>;
