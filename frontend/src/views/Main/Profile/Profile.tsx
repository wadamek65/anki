import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useMutation } from 'react-relay/hooks';
import { SelectorStoreUpdater } from 'relay-runtime';

import { Grid } from '../elements';
import { PageTitle } from '../../../components/Typography';
import { ActionInput } from '../../../components/Input';
import { ProfileAddLanguageMutation } from './__generated__/ProfileAddLanguageMutation.graphql';
import { LanguageList } from './components/LanguageList';

const addLanguageUpdater: SelectorStoreUpdater = store => {
	const records = store.getRoot().getLinkedRecord('user')?.getLinkedRecord('appSettings');
	if (records !== null) {
		const languages = records?.getLinkedRecords('languages') || [];
		const newLanguage = store.getRootField('addLanguage')?.getLinkedRecord('language') as any;
		records?.setLinkedRecords([...languages, newLanguage], 'languages');
	}
};

export const Profile: React.FC = () => {
	const [language, setLanguage] = React.useState<string>('');

	const [commitAddLanguage] = useMutation<ProfileAddLanguageMutation>(graphql`
		mutation ProfileAddLanguageMutation($input: AddLanguageInput!) {
			addLanguage(input: $input) {
				language {
					id
					name
					color
				}
			}
		}
	`);

	const addLanguage = () => {
		setLanguage('');
		commitAddLanguage({
			variables: { input: { name: language, color: '#fff' } },
			optimisticResponse: {
				addLanguage: {
					language: {
						id: 'temp-id',
						name: language,
						color: '#fff'
					}
				}
			},
			optimisticUpdater: addLanguageUpdater,
			updater: addLanguageUpdater
		});
	};

	return (
		<Grid>
			<PageTitle>Profile</PageTitle>
			<ActionInput
				value={language}
				onChange={e => setLanguage(e.target.value)}
				name="language"
				label="Languages"
				onClick={addLanguage}
			>
				Add
			</ActionInput>
			<React.Suspense fallback={<div>Loading...</div>}>
				<LanguageList />
			</React.Suspense>
		</Grid>
	);
};
