import { RouteComponentProps } from '@reach/router'; // eslint-disable-line
import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { preloadQuery, useFragment, useLazyLoadQuery, usePreloadedQuery } from 'react-relay/hooks';
import { commitMutation } from 'relay-runtime';
import styled from 'styled-components';

import { Grid } from '../components/elements';
import { Filters } from '../components/Filters';
import { ListItem, ListItemPlaceholder } from '../components/ListItem';
import { Input } from '../components/Input';
import { PageTitle } from '../components/PageTitle';
import { AddNewTextButton } from '../components/TextButton';
import { createDeck } from '../lib/mutations';
import { environment } from '../lib/relay';
import { DecksQuery, DecksQueryResponse } from './__generated__/DecksQuery.graphql';

const StyledDeckList = styled.ul`
	grid-column: 1 / -1;
`;

const query = graphql`
	query DecksQuery {
		viewer {
			...Decks_decks
		}
	}
`;
const result = preloadQuery<DecksQuery>(environment, query, {});

const DeckList = (props) => {
	const data = useFragment(graphql`
		fragment Decks_decks on Viewer {
			decks {
				id
				title
			}
		}
	`, props.decks);
	console.log(props);
	return (
		<StyledDeckList>
			{ data.decks.map(deck => <ListItem key={deck.id} topLeftItem={deck.title} bottomLeftItem={'10 words'} bottomRightItem={'sometime ago'}/>)}
		</StyledDeckList>
	)
};

const DecksData = () => {
	const data: DecksQueryResponse = usePreloadedQuery(query, result);

	const addNewDeck = () => commitMutation(environment, {
		mutation: createDeck,
		variables: { input: {} },
		// updater: store => {
		// 	const newDeck = store.getRootField('createDeck');
		// 		store.create(newDeck.getDataID(), newDeck.getType());
		// },
		onCompleted: res => {
			console.log(res);
		},
		onError: error => {
			console.log(error);
		}
	});
	console.log(data);
	return 		<Grid>
		<PageTitle title={'Your decks'}/>
		<Filters/>
		<Input/>
		<AddNewTextButton onClick={addNewDeck}>Create new deck</AddNewTextButton>
		<DeckList decks={data.viewer}/>
	</Grid>;
};

const DecksPlaceholder = () => (
	<Grid>
		<PageTitle title={'Your decks'}/>
		<Filters/>
		<Input/>
		<AddNewTextButton onClick={() => {}}>Create new deck</AddNewTextButton>
		<StyledDeckList>
			{Array.apply(null, Array(10)).map((_, index) => <ListItemPlaceholder key={index} topRight={false}/>)}
		</StyledDeckList>
	</Grid>
);

export const Decks = (_props: RouteComponentProps) => {
	return (
		<React.Suspense fallback={<DecksPlaceholder/>}>
			<DecksData/>
		</React.Suspense>
	);
};
