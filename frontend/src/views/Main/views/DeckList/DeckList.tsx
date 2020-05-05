import graphql from 'babel-plugin-relay/macro';
import { format } from 'date-fns';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useLazyLoadQuery, useMutation } from 'react-relay/hooks';

import { AddNewTextButton, List } from '../../../../components';
import { Input } from '../../../../components/Input';
import { PageTitle } from '../../../../components/Typography';
import { Grid, ListPlaceholder, GridSpan } from '../elements';
import { DeckListGetDecksQuery } from './__generated__/DeckListGetDecksQuery.graphql';

const Decks: React.FC = () => {
	const data = useLazyLoadQuery<DeckListGetDecksQuery>(
		graphql`
			query DeckListGetDecksQuery {
				decks {
					id
					title
					createdAt
					cardsAmount
				}
			}
		`,
		{},
		{ fetchPolicy: 'store-and-network' }
	);

	const sortedDecks = [...data.decks].reverse();
	const getTitle = (title: string): string => (title === '' ? 'Untitled deck' : title);

	return (
		<>
			{sortedDecks.map(deck => (
				<List.Item
					key={deck.id}
					topLeftItem={<Link to={`${deck.id}/cards`}>{getTitle(deck.title)}</Link>}
					bottomLeftItem={`${deck.cardsAmount} cards`}
					bottomRightItem={`Created at ${format(new Date(deck.createdAt), 'd.M.yyyy')}`}
				/>
			))}
		</>
	);
};

export const DeckList: React.FC = () => {
	const navigate = useNavigate();

	const [commitCreateDeck] = useMutation(graphql`
		mutation DeckListCreateDeckMutation($input: CreateDeckInput) {
			createDeck(input: $input) {
				deck {
					id
				}
			}
		}
	`);

	const createNewDeck = (): void =>
		commitCreateDeck({
			variables: { input: {} },
			onCompleted: (data: any) => {
				navigate(`/decks/${data.createDeck.deck.id}/cards`);
			}
		});

	return (
		<Grid>
			<PageTitle>Your decks</PageTitle>
			<Input label={'Filter decks'} />
			<AddNewTextButton onClick={createNewDeck}>Create new deck</AddNewTextButton>
			<GridSpan>
				{/* TODO: Add error boundary*/}
				<React.Suspense fallback={<ListPlaceholder />}>
					<Decks />
				</React.Suspense>
			</GridSpan>
		</Grid>
	);
};
