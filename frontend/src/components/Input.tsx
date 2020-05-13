import * as React from 'react';
import ReactSelect, { Props as SelectProps } from 'react-select';
// eslint-disable-next-line import/named
import styled, { css, DefaultTheme } from 'styled-components';

import { FlatButton } from './Button';

export const GridForm = styled.form(
	({ theme }) => css`
		display: grid;
		grid-column: 1 / -1;
		grid-row-gap: ${theme.spacing.medium};
	`
);

const commonStyles = ({ theme }: { theme: DefaultTheme }) => css`
	background-color: ${theme.color.white};
	box-sizing: border-box;
	border: 0.7px solid ${theme.color.gray[0]};
	border-radius: 4px;
	color: #000;
	cursor: text;
	font-size: 16px;
	font-weight: ${theme.font.weight.medium};
	grid-column: 1 / -1;
	height: 38px;
	min-height: 38px;
	padding: 8px;
	width: 100%;

	&:focus {
		border: 0.5px solid ${theme.color.primary[0]};
		box-shadow: inset 0 0 2px ${theme.color.primary[0]};
	}

	&::placeholder {
		font-weight: ${theme.font.weight.regular};
	}
`;

const Label = styled.label(
	({ theme }) => css`
		color: ${theme.color.primary[0]};
		display: grid;
		font-size: 14px;
		grid-column: 1 / -1;
		grid-template-rows: 20px 1fr;
		line-height: 16px;
		font-weight: ${theme.font.weight.semiBold};
	`
);

const CustomInput = styled.input(commonStyles);
const CustomTextArea = styled.textarea(
	commonStyles,
	() => css`
		height: 100px;
		resize: vertical;
	`
);

export const Select: React.FC<SelectProps & { label: string }> = ({ label, ...props }) => (
	<Label>
		{label}
		<ReactSelect {...props} />
	</Label>
);

type InputProps = { label: string } & React.InputHTMLAttributes<HTMLInputElement>;
type TextAreaProps = { label: string } & React.InputHTMLAttributes<HTMLTextAreaElement>;

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
	return (
		<Label>
			{label}
			<CustomInput {...props} />
		</Label>
	);
};

export const NoLabelInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => <CustomInput {...props} />;

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
	return (
		<Label>
			{label}
			<CustomTextArea {...props} />
		</Label>
	);
};

const CustomActionLabel = styled(Label)`
	grid-template-columns: 1fr min-content;
`;

const CustomActionLabelText = styled.span`
	grid-column: 1 / -1;
`;

const CustomActionInput = styled(CustomInput)`
	border-radius: 4px 0 0 4px;
	grid-column: 1;
	height: 32px;
`;

const CustomActionInputButton = styled(FlatButton)`
	border-radius: 0 4px 4px 0;
	grid-column: 2;
`;

export const ActionInput: React.FC<InputProps & { onClick?: () => void }> = ({
	label,
	onClick,
	children,
	...props
}) => {
	return (
		<CustomActionLabel>
			<CustomActionLabelText>{label}</CustomActionLabelText>
			<CustomActionInput {...props} />
			<CustomActionInputButton onClick={onClick}>{children}</CustomActionInputButton>
		</CustomActionLabel>
	);
};
