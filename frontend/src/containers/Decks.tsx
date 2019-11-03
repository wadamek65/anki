import { RouteComponentProps } from '@reach/router'; // eslint-disable-line
import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import styled from 'styled-components';

import { Grid } from '../components/elements';
import { Filters } from '../components/Filters';
import { ListItem, ListItemPlaceholder } from '../components/ListItem';
import { Input } from '../components/Input';
import { PageTitle } from '../components/PageTitle';
import { AddNewTextButton } from '../components/TextButton';
import { DecksQuery, DecksQueryResponse } from './__generated__/DecksQuery.graphql';

const DeckList = styled.ul`
	grid-column: 1 / -1;
`;

const DecksData = () => {
	const data = useLazyLoadQuery<DecksQuery>(
		graphql`
			query DecksQuery {
				decks {
					id
					title
				}
			}
		`,
		{}
	);

	return <DecksTemplate decks={data.decks} />;
};

const DecksTemplate = ({ decks, template = false }: DecksQueryResponse & { template?: boolean }) => (
	<Grid>
		<PageTitle title={'Your decks'} />
		<Filters />
		<Input />
		<AddNewTextButton onClick={() => console.log('eys')}>Create new deck</AddNewTextButton>
		<DeckList>
			{template
				? Array.apply(null, Array(10)).map((_, index) => <ListItemPlaceholder key={index} topRight={false} />)
				: decks.map(deck => (
						<ListItem topLeftItem={deck.title} bottomLeftItem={'10 words'} bottomRightItem={'sometime ago'} />
				  ))}
		</DeckList>
	</Grid>
);

export const Decks = (_props: RouteComponentProps) => {
	return (
		<React.Suspense fallback={<DecksTemplate template={true} decks={[]} />}>
			<DecksData />
		</React.Suspense>
	);
};
