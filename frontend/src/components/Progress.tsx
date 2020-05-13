import * as React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div(
	({ theme }) => css`
		background-color: ${theme.color.gray[4]};
		grid-column: 1 / -1;
		height: 12px;
		width: 100%;
	`
);
const ColoredProgress = styled.div(
	({ theme }) => css`
		background: fixed linear-gradient(90deg, ${theme.color.yellow} 0%, ${theme.color.green} 100%);
		height: 100%;
	`
);

export const Progress: React.FC<{ value: number }> = ({ value }) => (
	<Container>
		<ColoredProgress style={{ width: `${value * 100}%` }} />
	</Container>
);
