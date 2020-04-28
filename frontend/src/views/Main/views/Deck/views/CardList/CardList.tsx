import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useFragment } from 'react-relay/hooks';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-relay/lib/relay-experimental';

import { CardList_cards$key } from './__generated__/CardList_cards.graphql';
import { Input } from '../../../../../../components/Input';
import { AddNewTextButton, List } from '../../../../../../components';
import { GridSpan } from '../../../elements';

export const CardList: React.FC<{ deck: CardList_cards$key }> = ({ deck }) => {
	const { deckId } = useParams();
	const navigate = useNavigate();
	const data = useFragment<CardList_cards$key>(
		graphql`
			fragment CardList_cards on Deck {
				cards {
					id
					word
					language {
						learning
						original
					}
				}
			}
		`,
		deck
	);

	const [commitCreateCard] = useMutation(graphql`
		mutation CardListCreateCardMutation($input: CreateCardInput!) {
			createCard(input: $input) {
				card {
					id
				}
			}
		}
	`);

	const getCardTitle = (title: string): string => (title === '' ? 'Unnamed card' : title);
	const createCard = () =>
		commitCreateCard({
			variables: { input: { deckId } },
			onCompleted: (data: any) => navigate(`cards/${data.createCard.card.id}`)
		});

	return (
		<>
			{' '}
			<Input label={'Filter cards'} />
			<AddNewTextButton onClick={createCard}>Create new card</AddNewTextButton>
			<GridSpan>
				{data.cards.map(card => (
					<List.Item
						key={card.id}
						topLeftItem={<Link to={`cards/${card.id}`}>{getCardTitle(card.word)}</Link>}
						bottomLeftItem={card.language.original}
						bottomRightItem={card.language.learning}
					/>
				))}
			</GridSpan>
		</>
	);
};
