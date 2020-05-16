import graphql from 'babel-plugin-relay/macro';
import { format } from 'date-fns';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useLazyLoadQuery, useMutation, usePaginationFragment } from 'react-relay/hooks';

import { AddNewTextButton, List } from '../../../components';
import { Input } from '../../../components/Input';
import { PageTitle } from '../../../components/Typography';
import { Grid, GridSpan } from '../elements';
import { DeckList_decks$key } from './__generated__/DeckList_decks.graphql';
import { DeckListGetDeckPaginationQuery } from './__generated__/DeckListGetDeckPaginationQuery.graphql';

const Decks: React.FC<{ decks: DeckList_decks$key }> = ({ decks }) => {
	const { data } = usePaginationFragment(
		graphql`
			fragment DeckList_decks on Query @refetchable(queryName: "DeckListGetDecksQuery") {
				decks(first: $count, after: $cursor) @connection(key: "DeckList_decks_decks") {
					edges {
						node {
							id
							cardsAmount
							createdAt
							title
						}
					}
				}
			}
		`,
		decks
	);

	const sortedDecks = [...data.decks.edges].reverse();
	const getTitle = (title: string): string => (title === '' ? 'Untitled deck' : title);

	return (
		<>
			{sortedDecks.map(({ node }) => (
				<Link to={`${node.id}/cards`} key={node.id}>
					<List.Item
						topLeftItem={getTitle(node.title)}
						bottomLeftItem={`${node.cardsAmount} cards`}
						bottomRightItem={`Created at ${format(new Date(node.createdAt), 'd.M.yyyy')}`}
					/>
				</Link>
			))}
		</>
	);
};

export const DeckList: React.FC = () => {
	const navigate = useNavigate();

	const data = useLazyLoadQuery<DeckListGetDeckPaginationQuery>(
		graphql`
			query DeckListGetDeckPaginationQuery($count: Int, $cursor: String) {
				...DeckList_decks
			}
		`,
		{ count: 20 }
	);

	const [commitCreateDeck] = useMutation(graphql`
		mutation DeckListCreateDeckMutation($input: CreateDeckInput) {
			createDeck(input: $input) {
				deck {
					id
				}
			}
		}
	`);

	const createNewDeck = (): void => {
		commitCreateDeck({
			variables: { input: {} },
			onCompleted: (data: any) => {
				navigate(`/decks/${data.createDeck.deck.id}/cards`);
			}
		});
	};

	return (
		<Grid>
			<PageTitle>Your decks</PageTitle>
			<Input label={'Filter decks'} />
			<AddNewTextButton onClick={createNewDeck}>Create new deck</AddNewTextButton>
			<GridSpan>
				<Decks decks={data} />
			</GridSpan>
		</Grid>
	);
};
