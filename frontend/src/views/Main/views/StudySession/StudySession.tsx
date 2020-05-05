import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useParams } from 'react-router';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { Grid } from '../elements';
import { PageTitle } from '../../../../components/Typography';
import { OutlinedButton } from '../../../../components/Button';
import { StudySessionGetStudySessionQuery } from './__generated__/StudySessionGetStudySessionQuery.graphql';
import { Test } from './elements';

interface Question {
	readonly cardId: string;
	readonly answersLeft: number;
	readonly correctAnswers: number;
	readonly wrongAnswers: number;
	readonly from: string;
	readonly to: string;
	readonly translations: ReadonlyArray<string>;
	readonly word: string;
}

const useStudySession = (id: string) => {
	const { studySession } = useLazyLoadQuery<StudySessionGetStudySessionQuery>(
		graphql`
			query StudySessionGetStudySessionQuery($id: ID!) {
				studySession(id: $id) {
					#					derivedDeckId
					penalty
					#					startedAt
					questions {
						cardId
						answersLeft
						correctAnswers
						wrongAnswers
						from
						to
						translations
						word
						#						note
					}
				}
			}
		`,
		{ id }
	);

	const [questions, setQuestions] = React.useState<readonly Question[]>(studySession.questions);
	const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>(null);

	React.useEffect(() => {
		const questionArray = questions.filter(question => question.answersLeft > 0);
		if (questionArray.length === 0) {
			setCurrentQuestion(null);
			return;
		}
		if (questionArray.length === 1) {
			setCurrentQuestion(questionArray[0]);
			return;
		}

		setCurrentQuestion(prev => {
			const randomIndex = Math.floor(Math.random() * questionArray.length);
			if (questionArray[randomIndex].cardId === prev?.cardId) {
				if (randomIndex === 0) {
					return questionArray[randomIndex + 1];
				} else {
					return questionArray[randomIndex - 1];
				}
			}
			return questionArray[randomIndex];
		});
	}, [questions]);

	const markCorrect = React.useCallback(() => {
		if (currentQuestion !== null) {
			setQuestions(prevQuestions => [
				...prevQuestions.filter(question => question !== currentQuestion),
				{
					...currentQuestion,
					correctAnswers: currentQuestion.correctAnswers + 1,
					answersLeft: currentQuestion.answersLeft - 1
				}
			]);
		}
	}, [setQuestions, currentQuestion]);

	const markWrong = React.useCallback(() => {
		if (currentQuestion !== null) {
			setQuestions(prevQuestions => [
				...prevQuestions.filter(question => question !== currentQuestion),
				{
					...currentQuestion,
					wrongAnswers: currentQuestion.wrongAnswers + 1,
					answersLeft: currentQuestion.answersLeft + studySession.penalty
				}
			]);
		}
	}, [setQuestions, currentQuestion, studySession.penalty]);

	return { currentQuestion, markCorrect, markWrong, penalty: studySession.penalty };
};

const SessionContent: React.FC = () => {
	const { sessionId } = useParams();
	const { currentQuestion, markCorrect, markWrong, penalty } = useStudySession(sessionId);
	const [shouldShowAnswer, setShouldShowAnswer] = React.useState<boolean>(false);

	React.useEffect(() => {
		setShouldShowAnswer(false);
	}, [setShouldShowAnswer, currentQuestion]);

	if (currentQuestion !== null) {
		return (
			<Test.Container>
				<Test.Explanation>Translate</Test.Explanation>
				<Test.Question>{currentQuestion.word}</Test.Question>
				<Test.Explanation>From language</Test.Explanation>
				<Test.FromLanguage>{currentQuestion.from}</Test.FromLanguage>
				<Test.Explanation>To language</Test.Explanation>
				<Test.ToLanguage>{currentQuestion.to}</Test.ToLanguage>
				{!shouldShowAnswer && <OutlinedButton onClick={() => setShouldShowAnswer(true)}>Show Answer</OutlinedButton>}
				{shouldShowAnswer && (
					<>
						<Test.Explanation>Accepted answers</Test.Explanation>
						<Test.Translations>
							{currentQuestion.translations.map(translation => (
								<Test.Translation key={translation}>{translation}</Test.Translation>
							))}
						</Test.Translations>
						<Test.CorrectAnswer onClick={markCorrect}>
							Mark Correct<Test.AnswerButtonTooltip>(-1 to repeat number)</Test.AnswerButtonTooltip>
						</Test.CorrectAnswer>
						<Test.NeutralAnswer onClick={markWrong}>
							Mark Neutral<Test.AnswerButtonTooltip>(no change to repeat number)</Test.AnswerButtonTooltip>
						</Test.NeutralAnswer>
						<Test.WrongAnswer onClick={markWrong}>
							Mark Wrong<Test.AnswerButtonTooltip>(+{penalty} penalty to repeat number)</Test.AnswerButtonTooltip>
						</Test.WrongAnswer>
					</>
				)}
			</Test.Container>
		);
	}

	return <div>test finished</div>;
};

export const StudySession: React.FC = () => {
	return (
		<Grid>
			<PageTitle>Session</PageTitle>
			<React.Suspense fallback={<div>Loading session...</div>}>
				<SessionContent />
			</React.Suspense>
		</Grid>
	);
};
