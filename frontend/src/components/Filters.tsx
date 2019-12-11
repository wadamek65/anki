import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';

import { TextButton } from './TextButton';

const ToggleButton = styled(TextButton)`
	justify-self: end;
	font-weight: ${props => props.theme.font.weight.medium};
`;

export const Filters = () => (
	<ToggleButton onClick={() => console.log('asdqwe')} rightItem={<FontAwesomeIcon icon={faAngleDown} />}>
		Filters
	</ToggleButton>
);
