import * as React from 'react';
// eslint-disable-next-line import/named
import styled, { css, DefaultTheme } from 'styled-components';

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
	font-weight: ${theme.font.weight.medium};
	grid-column: 1 / -1;
	min-height: 30px;
	padding: 8px;
	height: 30px;

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

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
	return (
		<Label>
			{label}
			<CustomTextArea {...props} />
		</Label>
	);
};
