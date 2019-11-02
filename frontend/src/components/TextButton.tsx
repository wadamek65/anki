import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';

const StyledTextButton = styled.button`
	color: ${props => props.theme.color.primary.dark};
	cursor: pointer;
	font-weight: ${props => props.theme.font.weight.semiBold};
	font-size: ${props => props.theme.font.size.medium};
	grid-column: 1 / -1;
	justify-self: center;
`;

const Text = styled.span`
	margin: 0 ${props => props.theme.spacing.small};
`;

interface TextButtonProps {
	onClick: () => void;
	className?: string;
	leftItem?: JSX.Element | string;
	children?: JSX.Element | string;
	rightItem?: JSX.Element | string;
}

export const TextButton = ({ onClick, className, leftItem, rightItem, children }: TextButtonProps) => (
	<StyledTextButton className={className} onClick={onClick}>
		{leftItem}
		<Text>{children}</Text>
		{rightItem}
	</StyledTextButton>
);

export const AddNewTextButton = (props: TextButtonProps) => (
	<TextButton {...props} leftItem={<FontAwesomeIcon icon={faPlusSquare} />} />
);
