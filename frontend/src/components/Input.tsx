import styled from 'styled-components';


export const Input = styled.input`
	background-color: ${props => props.theme.color.background};
	border: 1px solid ${props => props.theme.color.gray.normal};
	border-radius: 4px;
	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.75);
	grid-column: 1 / -1;
	min-height: 20px;
	padding: 8px;
`;
