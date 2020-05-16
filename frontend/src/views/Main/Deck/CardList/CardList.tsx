import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { usePaginationFragment, useMutation } from 'react-relay/hooks';
import { useNavigate, useParams } from 'react-router';
import { Link, Route, Routes } from 'react-router-dom';
import { ConnectionHandler, SelectorStoreUpdater } from 'relay-runtime';

import { Input } from '../../../../components/Input';
import { AddNewTextButton, List } from '../../../../components';
import { GridSpan } from '../../elements';
import { CardList_deck$key } from './__generated__/CardList_deck.graphql';
import { Card } from './Card';
import { Card_appSettings$key } from './Card/__generated__/Card_appSettings.graphql';

export const createCardConnectionUpdater: (deckId: string) => SelectorStoreUpdater = (deckId: string) => store => {
	const record = store.get(deckId);
	const payload = store.getRootField('createCard');
	if (record && payload) {
		const connectionRecord = ConnectionHandler.getConnection(record, 'CardList_deck_cards');
		if (connectionRecord) {
			const serverEdge = payload.getLinkedRecord('cardEdge');
			const newEdge = ConnectionHandler.buildConnectionEdge(store, connectionRecord, serverEdge);
			if (newEdge) {
				ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
			}
		}
	}
};

export const CardList: React.FC<{ deck: CardList_deck$key; appSettingsData: Card_appSettings$key }> = ({
	deck,
	appSettingsData
}) => {
	const { deckId } = useParams();
	const navigate = useNavigate();
	const { data } = usePaginationFragment(
		graphql`
			fragment CardList_deck on Deck @refetchable(queryName: "CardListPaginationQuery") {
				cards(first: $count, after: $cursor) @connection(key: "CardList_deck_cards") {
					edges {
						node {
							...Card_card
							id
							word
							language {
								learning {
									name
								}
								original {
									name
								}
							}
						}
					}
				}
			}
		`,
		deck
	);

	const [commitCreateCard] = useMutation(graphql`
		mutation CardListCreateCardMutation($input: CreateCardInput!) {
			createCard(input: $input) {
				cardEdge {
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

	const getCardTitle = (title: string): string => (title === '' ? 'Unnamed card' : title);
	const createCard = () =>
		commitCreateCard({
			variables: { input: { deckId } },
			updater: createCardConnectionUpdater(deckId),
			onCompleted: (data: any) => navigate(data.createCard.cardEdge.node.id)
		});

	return (
		<Routes>
			{data.cards.edges.map(edge => (
				<Route
					key={edge.node.id}
					path={edge.node.id}
					element={<Card cardData={edge.node} appSettingsData={appSettingsData} />}
				/>
			))}

			<Route
				path={''}
				element={
					<>
						<Input label={'Filter cards'} />
						<AddNewTextButton onClick={createCard}>Create new card</AddNewTextButton>
						<GridSpan>
							{data.cards.edges.map(({ node }) => (
								<Link to={node.id} key={node.id}>
									<List.Item
										topLeftItem={getCardTitle(node.word)}
										bottomLeftItem={node.language.original.name}
										bottomRightItem={node.language.learning.name}
									/>
								</Link>
							))}
						</GridSpan>
					</>
				}
			/>
		</Routes>
	);
};
