import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { useFragment, useMutation } from 'react-relay/hooks';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

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
						learning {
							name
						}
						original {
							name
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
			onCompleted: (data: any) => navigate(data.createCard.card.id)
		});

	return (
		<>
			{' '}
			<Input label={'Filter cards'} />
			<AddNewTextButton onClick={createCard}>Create new card</AddNewTextButton>
			<GridSpan>
				{data.cards.map(card => (
					<Link to={card.id} key={card.id}>
						<List.Item
							topLeftItem={getCardTitle(card.word)}
							bottomLeftItem={card.language.original.name}
							bottomRightItem={card.language.learning.name}
						/>
					</Link>
				))}
			</GridSpan>
		</>
	);
};
