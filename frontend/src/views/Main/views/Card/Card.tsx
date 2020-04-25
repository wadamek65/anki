import { useFormik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import styled, { css } from 'styled-components';

import {
	Card as CardType,
	GetCardQuery,
	useCreateCardMutation,
	useGetCardQuery,
	useUpdateCardMutation
} from '../../../../__generated__/graphql';
import { FlatButton, OutlinedButton } from '../../../../components/Button';
import { Input, TextArea } from '../../../../components/Input';
import { withoutTypename } from '../../../../lib/utils';
import { createCardUpdater } from '../Deck';

const isCard = (data: any): data is GetCardQuery => data?.card?.__typename === 'Card';

const GridForm = styled.form(
	({ theme }) => css`
		display: grid;
		grid-column: 1 / -1;
		grid-row-gap: ${theme.spacing.medium};
	`
);

const CardForm: React.FC<{ card: CardType }> = ({ card }) => {
	const { deckId } = useParams();
	const navigate = useNavigate();
	const [updateCard] = useUpdateCardMutation();
	const [createCard] = useCreateCardMutation({
		update: createCardUpdater(deckId)
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { id, translations, ...rest } = withoutTypename(card);
	// TODO: Make translations a proper array
	const initialValues = { ...rest, translations: translations.join(',') };
	const { handleChange, values, handleSubmit } = useFormik({
		initialValues,
		onSubmit: cardValues =>
			updateCard({
				variables: {
					cardId: card.id,
					card: { ...cardValues, translations: cardValues.translations.split(',') }
				}
			})
	});

	const saveCard = (): void => {
		handleSubmit();
	};

	const saveAndCreateCard = async (): Promise<void> => {
		await handleSubmit();
		const newCard = await createCard({
			variables: {
				deckId,
				card: {
					language: {
						original: values.language.original,
						learning: values.language.learning
					}
				}
			}
		});
		navigate(`../${newCard.data.createCard.id}`);
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

export const Card: React.FC = () => {
	const { cardId } = useParams();
	// TODO: Remove this fetchPolicy once react-apollo gets their shit fixed on v3
	const { data, loading } = useGetCardQuery({ fetchPolicy: 'no-cache', variables: { id: cardId } });

	if (loading) {
		return <div>Loading...</div>;
	}

	if (isCard(data)) {
		return <CardForm card={data.card} />;
	}

	return <div>An unexpected error has occured.</div>;
};
