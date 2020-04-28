import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { useParams } from 'react-router';
import { Link, Route, Routes } from 'react-router-dom';

import { PageTitle } from '../../../../components';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { Grid, ReturnLink } from '../elements';
import { DeckDeckDataQuery } from './__generated__/DeckDeckDataQuery.graphql';
import { CardList } from './views/CardList';

export const DeckData: React.FC = () => {
	const { deckId } = useParams();

	const data = useLazyLoadQuery<DeckDeckDataQuery>(
		graphql`
			query DeckDeckDataQuery($id: ID!) {
				deck(id: $id) {
					title
					...CardList_cards
				}
			}
		`,
		{ id: deckId }
	);

	return (
		<>
			<PageTitle>{data.deck.title || 'Untitled deck'}</PageTitle>
			<Routes>
				<Route path={'/'} element={<CardList deck={data.deck} />} />
			</Routes>
		</>
	);
};

export const Deck: React.FC = () => {
	return (
		<Grid>
			<ReturnLink>
				<Link to={-1}>Return</Link>
			</ReturnLink>
			{/* TODO: Add error boundary*/}
			<ErrorBoundary>
				<React.Suspense fallback={<div>Loading deck ...</div>}>
					<DeckData />
				</React.Suspense>
			</ErrorBoundary>
		</Grid>
	);
};
