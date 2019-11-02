import * as React from 'react';
import styled from 'styled-components';

const Title = styled.header`
	font-size: ${props => props.theme.font.size.title};
	font-style: italic;
	font-weight: ${props => props.theme.font.weight.medium};
	grid-column: 1 / -1;
`;

export const PageTitle = ({ title }: { title: string }) => (
	<Title>
		{title}
	</Title>
);
