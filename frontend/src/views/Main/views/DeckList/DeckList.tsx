import { format } from 'date-fns';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import {
	Deck,
	GetDecksDocument,
	GetDecksQuery,
	useCreateDeckMutation,
	useGetDecksQuery
} from '../../../../__generated__/graphql';
import { AddNewTextButton, ListItem, PageTitle } from '../../../../components';
import { Input } from '../../../../components/Input';
import { Grid, ListPlaceholder, StyledList } from '../elements';

const DecksData: React.FC<{ decks: Omit<Deck, 'cards'>[] }> = ({ decks }) => {
	const getTitle = (title: string): string => (title === '' ? 'Untitled deck' : title);

	return (
		<StyledList>
			{decks.map(deck => (
				<ListItem
					key={deck.id}
					topLeftItem={<Link to={`/decks/${deck.id}/cards`}>{getTitle(deck.title)}</Link>}
					bottomLeftItem={`${deck.cardsAmount} cards`}
					bottomRightItem={`Created at ${format(new Date(deck.createdAt), 'd.M.yyyy')}`}
				/>
			))}
		</StyledList>
	);
};

export const DeckList: React.FC = () => {
	const navigate = useNavigate();
	const { data, loading, error } = useGetDecksQuery({ fetchPolicy: 'no-cache' });
	const [createDeck] = useCreateDeckMutation({
		update(client, { data: { createDeck } }) {
			const data = client.readQuery<GetDecksQuery>({ query: GetDecksDocument });
			const decks = data?.decks || [];
			client.writeQuery({ query: GetDecksDocument, data: { decks: decks.concat(createDeck) } });
		}
	});

	const createNewDeck = async (): Promise<void> => {
		const { data: newDeckData } = await createDeck();
		if (newDeckData?.createDeck) {
			navigate(`/decks/${newDeckData.createDeck.id}/cards`);
		}
	};

	const sortedDecks = data?.decks ? [...data.decks].reverse() : [];

	return (
		<Grid>
			<PageTitle>Your decks</PageTitle>
			<Input label={'Filter decks'} />
			<AddNewTextButton onClick={createNewDeck}>Create new deck</AddNewTextButton>
			<StyledList>
				{loading && <ListPlaceholder />}
				{/* TODO: Add error page */}
				{error && 'An error has occured.'}
				{data && <DecksData decks={sortedDecks} />}
			</StyledList>
		</Grid>
	);
};
