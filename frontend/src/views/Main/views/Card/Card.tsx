import graphql from 'babel-plugin-relay/macro';
import { useFormik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useFragment, useLazyLoadQuery } from 'react-relay/hooks';
import { useMutation } from 'react-relay/lib/relay-experimental';

import { FlatButton, OutlinedButton } from '../../../../components/Button';
import { GridForm, Input, Select, TextArea } from '../../../../components/Input';
import { Grid, ReturnLink } from '../elements';
import { Card_card$key } from './__generated__/Card_card.graphql';
import { CardGetCardQuery } from './__generated__/CardGetCardQuery.graphql';
import { CardGetLanguagesQuery } from './__generated__/CardGetLanguagesQuery.graphql';
import { Card_appSettings$key } from './__generated__/Card_appSettings.graphql';

const EditForm: React.FC<{ card: Card_card$key; appSettings: Card_appSettings$key }> = ({ card, appSettings }) => {
	const { cardId, deckId } = useParams();
	const navigate = useNavigate();

	const languagesData = useFragment<Card_appSettings$key>(
		graphql`
			fragment Card_appSettings on AppSettings {
				languages {
					id
					name
				}
			}
		`,
		appSettings
	);

	const data = useFragment<Card_card$key>(
		graphql`
			fragment Card_card on Card {
				word
				translations
				note
				language {
					learning {
						name
						id
					}
					original {
						name
						id
					}
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

	const initialValues = {
		...data,
		translations: data.translations.join(','),
		language: {
			learning: data.language.learning.id,
			original: data.language.original.id
		}
	};
	const { handleChange, values, handleSubmit, setValues, setFieldValue } = useFormik({
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
		navigate('..');
	};

	const saveAndCreateCard = async (): Promise<void> => {
		await handleSubmit();
		commitCreateCard({
			variables: {
				input: {
					deckId,
					...values
				}
			},
			onCompleted: (data: any) => navigate(`../${data.createCard.card.id}`)
		});
		setValues({ ...initialValues, language: values.language });
	};

	const languageOptions = languagesData.languages.map(language => ({ label: language.name, value: language.id }));

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
			<Select
				label="Original Language"
				options={languageOptions}
				onChange={value => setFieldValue('language.original', (value as any).value)}
				defaultValue={{ value: data.language.original.id, label: data.language.original.name }}
			/>
			<Select
				label="Learning Language"
				options={languageOptions}
				onChange={value => setFieldValue('language.learning', (value as any).value)}
				defaultValue={{ value: data.language.learning.id, label: data.language.learning.name }}
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

	const cardData = useLazyLoadQuery<CardGetCardQuery>(
		graphql`
			query CardGetCardQuery($id: ID!) {
				card(id: $id) {
					...Card_card
				}
			}
		`,
		{ id: cardId }
	);

	const languagesData = useLazyLoadQuery<CardGetLanguagesQuery>(
		graphql`
			query CardGetLanguagesQuery {
				user {
					appSettings {
						...Card_appSettings
					}
				}
			}
		`,
		{}
	);

	return <EditForm card={cardData.card} appSettings={languagesData.user.appSettings} />;
};

export const Card: React.FC = () => {
	return (
		<Grid>
			<Link as={ReturnLink} to={'..'}>
				Return
			</Link>
			{/* TODO: Add error boundary*/}
			<React.Suspense fallback={<div>Loading card ...</div>}>
				<CardData />
			</React.Suspense>
		</Grid>
	);
};
