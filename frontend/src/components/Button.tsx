import * as React from 'react';
import styled, { css } from 'styled-components';

type ButtonProps = { loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button(
	({ theme }) => css`
		background-color: ${theme.color.primary[0]};
		border-radius: 4px;
		color: ${theme.color.white};
		cursor: pointer;
		font-weight: ${theme.font.weight.semiBold};
		grid-column: 1 / -1;
		padding: 8px 16px;
		text-align: center;
	`
);

export const FlatButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
	return <StyledButton {...rest}>{children}</StyledButton>;
};

export const OutlinedButton = styled(FlatButton)(
	({ theme }) => css`
		background-color: ${theme.color.white};
		border: 1.5px solid ${theme.color.primary[0]};
		color: ${theme.color.primary[0]};
	`
);
