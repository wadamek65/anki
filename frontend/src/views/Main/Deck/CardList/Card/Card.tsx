import graphql from 'babel-plugin-relay/macro';
import { useFormik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useFragment, useMutation } from 'react-relay/hooks';

import { FlatButton, OutlinedButton } from '../../../../../components/Button';
import { GridForm, Input, Select, TextArea } from '../../../../../components/Input';
import { Card_card$key, Card_card$data } from './__generated__/Card_card.graphql';
import { Card_appSettings$key } from './__generated__/Card_appSettings.graphql';
import { CardCreateCardMutation } from './__generated__/CardCreateCardMutation.graphql';
import { createCardConnectionUpdater } from '../CardList';

const EditForm: React.FC<{ card: Card_card$data; appSettings: Card_appSettings$key }> = ({ card, appSettings }) => {
	const { deckId } = useParams();
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

	const [commitCreateCard] = useMutation<CardCreateCardMutation>(graphql`
		mutation CardCreateCardMutation($input: CreateCardInput!) {
			createCard(input: $input) {
				cardEdge {
					cursor
					node {
						id
						language {
							learning {
								color
								id
								name
							}
							original {
								color
								id
								name
							}
						}
						note
						translations
						word
					}
				}
			}
		}
	`);

	const [commitUpdateCard] = useMutation(graphql`
		mutation CardUpdateCardMutation($input: UpdateCardInput!) {
			updateCard(input: $input) {
				card {
					id
					language {
						learning {
							color
							id
							name
						}
						original {
							color
							id
							name
						}
					}
					note
					translations
					word
				}
			}
		}
	`);

	const initialValues = {
		note: card.note,
		word: card.word,
		translations: card.translations.join(','),
		language: {
			learning: card.language.learning.id,
			original: card.language.original.id
		}
	};
	const { handleChange, values, handleSubmit, setFieldValue } = useFormik({
		initialValues,
		onSubmit: cardValues => {
			commitUpdateCard({
				variables: {
					input: {
						cardId: card.id,
						...cardValues,
						translations: cardValues.translations.split(',')
					}
				}
			});
		}
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
					language: values.language
				}
			},
			updater: createCardConnectionUpdater(deckId),
			onCompleted: response => {
				navigate(`../${response.createCard.cardEdge.node.id}`);
			}
		});
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
				defaultValue={{ value: card.language.original.id, label: card.language.original.name }}
			/>
			<Select
				label="Learning Language"
				options={languageOptions}
				onChange={value => setFieldValue('language.learning', (value as any).value)}
				defaultValue={{ value: card.language.learning.id, label: card.language.learning.name }}
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

export const Card: React.FC<{ cardData: Card_card$key; appSettingsData: Card_appSettings$key }> = ({
	cardData,
	appSettingsData
}) => {
	const card = useFragment<Card_card$key>(
		graphql`
			fragment Card_card on Card {
				id
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
		cardData
	);

	return <EditForm card={card} appSettings={appSettingsData} />;
};
