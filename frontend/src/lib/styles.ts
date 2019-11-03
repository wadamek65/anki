import { css } from 'styled-components';

export const mobile = (styles: string) => css`
	@media only screen and (max-width: 500px) {
		${styles}
	}
`;

export const grid = css`
	display: grid;
	${mobile(`
			grid-column-gap: 16px;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			grid-template-rows: auto;
			margin: 0 16px;
		`)}
`;

export const placeholderStyles = css`
	background-color: ${({ theme }) => theme.color.gray.placeholder};
	border-radius: 10px;
`;
