import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { useNavigate, useParams } from 'react-router';
import { Route, Routes } from 'react-router-dom';

import { FlatButton } from '../../../components/Button';
import { PageTitle } from '../../../components/Typography';
import { Grid, ReturnLink } from '../elements';
import { DeckDeckDataQuery } from './__generated__/DeckDeckDataQuery.graphql';
import { CardList } from './CardList';
import { DeckGetLanguagesQuery } from './__generated__/DeckGetLanguagesQuery.graphql';

export const Deck: React.FC = () => {
	const { deckId } = useParams();
	const navigate = useNavigate();

	const data = useLazyLoadQuery<DeckDeckDataQuery>(
		graphql`
			query DeckDeckDataQuery($id: ID!, $count: Int, $cursor: String) {
				deck(id: $id) {
					title
					...CardList_deck
				}
			}
		`,
		{ id: deckId, count: 50 }
	);

	const appSettingsData = useLazyLoadQuery<DeckGetLanguagesQuery>(
		graphql`
			query DeckGetLanguagesQuery {
				user {
					appSettings {
						...Card_appSettings
					}
				}
			}
		`,
		{}
	);

	return (
		<Grid>
			<ReturnLink onClick={() => navigate('./cards')}>Return to deck</ReturnLink>
			{/* TODO: Add error boundary*/}
			<PageTitle>{data.deck.title || 'Untitled deck'}</PageTitle>
			<FlatButton onClick={() => navigate(`/study/${deckId}`)}>Study this deck</FlatButton>
			<Routes>
				<Route
					path={'cards/*'}
					element={<CardList deck={data.deck} appSettingsData={appSettingsData.user.appSettings} />}
				/>
			</Routes>
		</Grid>
	);
};
