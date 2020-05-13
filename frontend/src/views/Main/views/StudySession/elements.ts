import styled, { css } from 'styled-components';

import { FlatButton } from '../../../../components/Button';

const Container = styled.div`
	display: grid;
	grid-column: 1 / -1;
	grid-template-columns: 1fr;
`;

const Explanation = styled.div`
	grid-column: 1 / -1;
	text-align: center;
`;
const Question = styled.div(
	({ theme }) => css`
		color: ${theme.color.primary[1]};
		font-size: 28px;
		font-weight: ${theme.font.weight.bold};
		grid-column: 1 / -1;
		margin-bottom: 16px;
		text-align: center;
	`
);

const FromLanguage = styled.div<{ color: string }>(
	({ theme, color }) => css`
		color: ${color};
		font-size: 20px;
		font-weight: ${theme.font.weight.medium};
		margin-bottom: 30px;
		text-align: center;
	`
);

const ToLanguage = styled.div<{ color: string }>(
	({ theme, color }) => css`
		color: ${color};
		font-size: 26px;
		font-weight: ${theme.font.weight.semiBold};
		margin-bottom: 24px;
		text-align: center;
	`
);

const Answer = styled(FlatButton)`
	padding: 12px 16px;
`;

const CorrectAnswer = styled(Answer)(
	({ theme }) => css`
		background-color: ${theme.color.green};
		margin-bottom: 16px;
	`
);

const WrongAnswer = styled(Answer)(
	({ theme }) => css`
		background-color: ${theme.color.red};
		margin-bottom: 16px;
	`
);

const NeutralAnswer = styled(Answer)(
	({ theme }) => css`
		background-color: ${theme.color.yellow};
		margin-bottom: 16px;
	`
);

const AnswerButtonTooltip = styled.div(
	({ theme }) => css`
		font-size: ${theme.font.size.regular};
		font-weight: ${theme.font.weight.regular};
	`
);

const Translations = styled.ul`
	margin-bottom: 16px;
`;

const Translation = styled.li(
	({ theme }) => css`
		display: block;
		font-weight: ${theme.font.weight.medium};
		margin: 4px 0;

		&:before {
			content: '- ';
		}
	`
);

export const Test = {
	AnswerButtonTooltip,
	Container,
	CorrectAnswer,
	Explanation,
	FromLanguage,
	NeutralAnswer,
	Question,
	ToLanguage,
	Translation,
	Translations,
	WrongAnswer
};
