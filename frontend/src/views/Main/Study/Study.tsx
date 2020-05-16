import graphql from 'babel-plugin-relay/macro';
import { useFormik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'react-relay/hooks';

import { PageTitle } from '../../../components/Typography';
import { GridForm, Input, Select } from '../../../components/Input';
import { FlatButton } from '../../../components/Button';
import { Grid } from '../elements';
import {
	StartStudySessionInput,
	StudyStartStudySessionMutation
} from './__generated__/StudyStartStudySessionMutation.graphql';

const StudyDirection = {
	Both: 'Both',
	Standard: 'Standard',
	Reverse: 'Reverse'
};

const selectOptions = Object.keys(StudyDirection).map(key => ({ label: key, value: key.toUpperCase() }));

export const Study: React.FC = () => {
	const { deckId } = useParams();
	const navigate = useNavigate();

	const [commitStartStudySession] = useMutation<StudyStartStudySessionMutation>(graphql`
		mutation StudyStartStudySessionMutation($input: StartStudySessionInput!) {
			startStudySession(input: $input) {
				session {
					id
				}
			}
		}
	`);

	const { handleChange, values, handleSubmit, setFieldValue } = useFormik<StartStudySessionInput>({
		initialValues: {
			repeatNumber: 3,
			deckId,
			direction: 'STANDARD',
			penalty: 2
		},
		onSubmit: values => {
			commitStartStudySession({
				variables: { input: values },
				onCompleted: data => navigate(`/study/session/${data.startStudySession.session.id}`)
			});
		}
	});

	return (
		<Grid>
			<PageTitle>Study</PageTitle>
			<GridForm onSubmit={handleSubmit}>
				<Input
					type="number"
					label="Repeat Number"
					name="repeatNumber"
					placeholder="How many times a question is repeated"
					onChange={handleChange}
					value={values.repeatNumber}
				/>
				<Input
					label="Penalty"
					name="penalty"
					placeholder="How many times more a question is repeated on wrong answer"
					onChange={handleChange}
					value={values.penalty}
				/>
				<Select
					label="Study Direction"
					name="direction"
					placeholder="Whether you want to study original/learning language or both (2 times more questions)"
					onChange={value => setFieldValue('direction', (value as any).value)}
					options={selectOptions}
					defaultValue={{ value: StudyDirection.Standard.toUpperCase(), label: StudyDirection.Standard }}
				/>
				<FlatButton type="submit">Start Study Sesssion</FlatButton>
			</GridForm>
		</Grid>
	);
};
