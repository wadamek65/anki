import styled from 'styled-components';

import { grid } from '../lib/styles';

export const Grid = styled.div`
	${grid};
	grid-row-gap: ${props => props.theme.spacing.medium};
	padding-top: ${props => props.theme.spacing.veryLarge};
`;
