import { faCheck, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { SelectorStoreUpdater } from 'relay-runtime';
import { useLazyLoadQuery, useMutation } from 'react-relay/hooks';
import { useFormik } from 'formik';

import { NoLabelInput } from '../../../../../components/Input';
import { LanguageListGetAppSettingsQuery } from './__generated__/LanguageListGetAppSettingsQuery.graphql';
import { LanguageListRemoveLanguageMutation } from './__generated__/LanguageListRemoveLanguageMutation.graphql';
import { LanguageListElements } from './elements';
import { LanguageListUpdateLanguageMutation } from './__generated__/LanguageListUpdateLanguageMutation.graphql';

const removeLanguageUpdater: SelectorStoreUpdater = store => {
	const records = store.getRoot().getLinkedRecord('user')?.getLinkedRecord('appSettings');
	if (records !== null) {
		const languages = records?.getLinkedRecords('languages') || [];
		const newLanguage = store.getRootField('removeLanguage')?.getValue('languageId') as string;
		records?.setLinkedRecords(
			languages.filter(language => language.getValue('id') !== newLanguage),
			'languages'
		);
	}
};

type Language = LanguageListGetAppSettingsQuery['response']['user']['appSettings']['languages'][number];

const LanguageEntry: React.FC<{ language: Language }> = ({ language }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false);
	const [commitUpdateLanguage] = useMutation<LanguageListUpdateLanguageMutation>(graphql`
		mutation LanguageListUpdateLanguageMutation($input: UpdateLanguageInput!) {
			updateLanguage(input: $input) {
				language {
					id
					name
					color
				}
			}
		}
	`);

	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: language,
		onSubmit: input => {
			commitUpdateLanguage({
				variables: { input },
				optimisticUpdater: store => {
					const storedData = store.get(input.id);
					if (storedData) {
						storedData.setValue(input.name, 'name');
						storedData.setValue(input.color, 'color');
					}
				}
			});
		}
	});

	const saveEdit = () => {
		handleSubmit();
		setIsEditing(false);
	};

	const [commitRemoveLanguage] = useMutation<LanguageListRemoveLanguageMutation>(graphql`
		mutation LanguageListRemoveLanguageMutation($input: RemoveLanguageInput!) {
			removeLanguage(input: $input) {
				languageId
			}
		}
	`);

	const removeLanguage = () =>
		commitRemoveLanguage({
			variables: { input: { languageId: language.id } },
			optimisticResponse: {
				removeLanguage: { languageId: language.id }
			},
			// TODO: Check why .delete doesn't work
			optimisticUpdater: removeLanguageUpdater,
			updater: removeLanguageUpdater
		});

	if (isEditing) {
		return (
			<LanguageListElements.Row>
				<td>
					<NoLabelInput name="name" onChange={handleChange} value={values.name} />
				</td>
				<td>
					<NoLabelInput name="color" onChange={handleChange} value={values.color} />
				</td>
				<td>
					<LanguageListElements.Icon icon={faCheck} onClick={saveEdit} />
					<LanguageListElements.Icon icon={faTrash} onClick={removeLanguage} />
				</td>
			</LanguageListElements.Row>
		);
	}

	return (
		<LanguageListElements.Row>
			<td>{language.name}</td>
			<LanguageListElements.Color color={language.color}>{language.color}</LanguageListElements.Color>
			<td>
				<LanguageListElements.Icon icon={faEdit} onClick={() => setIsEditing(true)} />
			</td>
		</LanguageListElements.Row>
	);
};

export const LanguageList: React.FC = () => {
	const data = useLazyLoadQuery<LanguageListGetAppSettingsQuery>(
		graphql`
			query LanguageListGetAppSettingsQuery {
				user {
					appSettings {
						languages {
							id
							name
							color
						}
					}
				}
			}
		`,
		{}
	);

	return (
		<table>
			<LanguageListElements.Head>
				<LanguageListElements.Row>
					<th>Name</th>
					<th>Color</th>
					<th>Actions</th>
				</LanguageListElements.Row>
			</LanguageListElements.Head>
			<tbody>
				{data.user.appSettings.languages.map(language => (
					<LanguageEntry key={language.id} language={language} />
				))}
			</tbody>
		</table>
	);
};
