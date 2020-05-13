import { css } from 'styled-components';

export const grid = css`
	display: grid;

	@media only screen and (max-width: 500px) {
		grid-column-gap: 16px;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-template-rows: auto;
		margin: 0 16px;
	}
	@media only screen and (min-width: 501px) {
		grid-column-gap: 16px;
		grid-template-columns: 70vw;
		grid-template-rows: auto;
		margin: 0 15vw;
	}
`;

export const placeholderStyles = css`
	background-color: ${({ theme }) => theme.color.gray[3]};
	border-radius: 10px;
`;
