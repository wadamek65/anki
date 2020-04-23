import * as React from 'react';
import { useParams } from 'react-router';
import { Link, Outlet } from 'react-router-dom';

import { AddNewTextButton, ListItem, PageTitle } from '../../../../components';
import { Input } from '../../../../components/Input';
import {
	Deck as DeckType,
	GetDeckDocument,
	GetDeckQuery,
	useCreateCardMutation,
	useGetDeckQuery
} from '../../../../__generated__/graphql';
import { StyledList } from '../elements';

const isDeck = (data: any): data is GetDeckQuery => data?.deck?.__typename === 'Deck';

export const Deck: React.FC = () => {
	const { deckId } = useParams();
	const { data, loading } = useGetDeckQuery({ variables: { id: deckId } });

	if (loading) {
		return <div>Loading...</div>;
	}

	if (isDeck(data)) {
		return (
			<>
				<PageTitle>{data.deck.title || 'Untitled deck'}</PageTitle>
				<Outlet />
			</>
		);
	}

	return <div>An unexpected error has occured.</div>;
};

export const DeckCards: React.FC = () => {
	const { deckId } = useParams();
	const { data, loading } = useGetDeckQuery({ fetchPolicy: 'no-cache', variables: { id: deckId } });

	const [createCard] = useCreateCardMutation({
		variables: { deckId },
		update(client, { data: { createCard: createCardData } }) {
			const data = client.readQuery<GetDeckQuery>({ query: GetDeckDocument, variables: { id: deckId } });
			const deckData = data?.deck as DeckType;
			client.writeQuery<GetDeckQuery>({
				query: GetDeckDocument,
				variables: { id: deckId },
				data: {
					deck: {
						...deckData,
						cards: [...deckData.cards, createCardData]
					}
				}
			});
		}
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	const getCardTitle = (title: string): string => (title === '' ? 'Unnamed card' : title);

	if (isDeck(data)) {
		return (
			<>
				<Input label={'Filter cards'} />
				<AddNewTextButton onClick={createCard}>Create new card</AddNewTextButton>
				<StyledList>
					{data.deck.cards.map(card => (
						<ListItem
							key={card.id}
							topLeftItem={<Link to={`${card.id}`}>{getCardTitle(card.word)}</Link>}
							bottomLeftItem={card.language.learning}
							bottomRightItem={card.language.original}
						/>
					))}
				</StyledList>
			</>
		);
	}

	return <div>An unexpected error has occured.</div>;
};
