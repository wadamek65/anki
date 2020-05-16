import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

const Head = styled.thead(
	({ theme }) => css`
		font-weight: ${theme.font.weight.semiBold};
		tr {
			border-bottom: 1px solid ${theme.color.gray[2]};
		}
	`
);

const Row = styled.tr`
	display: grid;
	grid-template-columns: 1fr 150px 100px;
	padding: 10px 0;

	td,
	th {
		height: 38px;
		line-height: 38px;
		padding: 0 10px;
	}
`;

const Icon = styled(FontAwesomeIcon)`
	cursor: pointer;
	font-size: 24px;
	margin: 0 8px;
`;

const Color = styled.td<{ color: string }>(
	({ color }) => css`
		color: ${color};
	`
);

export const LanguageListElements = {
	Color,
	Head,
	Icon,
	Row
};
