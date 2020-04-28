import graphql from 'babel-plugin-relay/macro';
import { useFormik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { useFragment, useLazyLoadQuery } from 'react-relay/hooks';
import { useMutation } from 'react-relay/lib/relay-experimental';

import { FlatButton, OutlinedButton } from '../../../../components/Button';
import { Input, TextArea } from '../../../../components/Input';
import { Grid, ReturnLink } from '../elements';
import { Card_card$key } from './__generated__/Card_card.graphql';
import { CardGetCardQuery } from './__generated__/CardGetCardQuery.graphql';

const GridForm = styled.form(
	({ theme }) => css`
		display: grid;
		grid-column: 1 / -1;
		grid-row-gap: ${theme.spacing.medium};
	`
);

const EditForm: React.FC<{ card: Card_card$key }> = ({ card }) => {
	const { cardId, deckId } = useParams();
	const navigate = useNavigate();

	const data = useFragment<Card_card$key>(
		graphql`
			fragment Card_card on Card {
				word
				translations
				note
				language {
					learning
					original
				}
			}
		`,
		card
	);

	const [commitCreateCard] = useMutation(graphql`
		mutation CardCreateCardMutation($input: CreateCardInput!) {
			createCard(input: $input) {
				card {
					id
				}
			}
		}
	`);

	const [commitUpdateCard] = useMutation(graphql`
		mutation CardUpdateCardMutation($input: UpdateCardInput!) {
			updateCard(input: $input) {
				card {
					id
				}
			}
		}
	`);

	const initialValues = { ...data, translations: data.translations.join(',') };
	const { handleChange, values, handleSubmit, setValues } = useFormik({
		initialValues,
		onSubmit: cardValues =>
			commitUpdateCard({
				variables: {
					input: {
						cardId,
						...cardValues,
						translations: cardValues.translations.split(',')
					}
				}
			})
	});

	const saveCard = (): void => {
		handleSubmit();
	};

	const saveAndCreateCard = async (): Promise<void> => {
		await handleSubmit();
		commitCreateCard({
			variables: {
				input: {
					deckId,
					language: {
						original: values.language.original,
						learning: values.language.learning
					}
				}
			},
			onCompleted: (data: any) => navigate(`../${data.createCard.card.id}`)
		});
		setValues({ ...initialValues, language: values.language });
	};

	return (
		<GridForm onSubmit={e => e.preventDefault()}>
			<Input
				label="Word"
				name="word"
				onChange={handleChange}
				value={values.word}
				placeholder="The word you are learning"
			/>
			<Input
				label="Translations"
				name="translations"
				onChange={handleChange}
				value={values.translations}
				placeholder="Translations (if multiple split by a comma)"
			/>
			<Input
				label="Original Language"
				name="language.original"
				onChange={handleChange}
				value={values.language.original}
				placeholder="Original word language"
			/>
			<Input
				label="Learning Language"
				name="language.learning"
				onChange={handleChange}
				value={values.language.learning}
				placeholder="The language you are trying to learn"
			/>
			<TextArea
				label="Note"
				name="note"
				onChange={handleChange}
				value={values.note}
				placeholder="Additional notes"
				type="textarea"
			/>

			<FlatButton type="submit" onClick={saveCard} name="save">
				Save card
			</FlatButton>
			<OutlinedButton type="submit" onClick={saveAndCreateCard} name="save-create">
				Save and create a new card
			</OutlinedButton>
		</GridForm>
	);
};

const CardData: React.FC = () => {
	const { cardId } = useParams();

	const data = useLazyLoadQuery<CardGetCardQuery>(
		graphql`
			query CardGetCardQuery($id: ID!) {
				card(id: $id) {
					...Card_card
				}
			}
		`,
		{ id: cardId }
	);

	return <EditForm card={data.card} />;
};

export const Card: React.FC = () => {
	return (
		<Grid>
			<ReturnLink>
				<Link to={-1}>Return</Link>
			</ReturnLink>
			{/* TODO: Add error boundary*/}
			<React.Suspense fallback={<div>Loading card ...</div>}>
				<CardData />
			</React.Suspense>
		</Grid>
	);
};
