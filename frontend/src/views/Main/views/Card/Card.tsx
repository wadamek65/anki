import { useFormik } from 'formik';
import * as React from 'react';
import { useParams } from 'react-router';
import styled, { css } from 'styled-components';

import {
	Card as CardType,
	GetCardQuery,
	useGetCardQuery,
	useUpdateCardMutation
} from '../../../../__generated__/graphql';
import { FlatButton, OutlinedButton } from '../../../../components/Button';
import { Input, TextArea } from '../../../../components/Input';
import { withoutTypename } from '../../../../lib/utils';

const isCard = (data: any): data is GetCardQuery => data?.card?.__typename === 'Card';

const GridForm = styled.form(
	({ theme }) => css`
		display: grid;
		grid-column: 1 / -1;
		grid-row-gap: ${theme.spacing.medium};
	`
);

const CardForm: React.FC<{ card: CardType }> = ({ card }) => {
	const [updateCard] = useUpdateCardMutation();

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
			<OutlinedButton type="submit" name="save-create">
				Save and create a new card
			</OutlinedButton>
		</GridForm>
	);
};

export const Card: React.FC = () => {
	const { cardId } = useParams();
	const { data, loading } = useGetCardQuery({ variables: { id: cardId } });

	if (loading) {
		return <div>Loading...</div>;
	}

	if (isCard(data)) {
		return <CardForm card={data.card} />;
	}

	return <div>An unexpected error has occured.</div>;
};
