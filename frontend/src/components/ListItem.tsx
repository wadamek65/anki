import * as React from 'react';
import styled, { css } from 'styled-components';

import { placeholderStyles } from '../lib/styles';

const Li = styled.li(
	({ theme }) => css`
		align-items: center;
		border-top: 1px solid ${theme.color.gray[3]};
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: 1fr 1fr;
		padding: 0 8px;
		&:last-child {
			border-bottom: 1px solid ${theme.color.gray[3]};
		}
	`
);

const ListItemTitle = styled.h1(
	({ theme }) => css`
		color: ${theme.color.gray[0]};
		cursor: pointer;
		font-size: ${theme.font.size.medium};
		font-weight: ${theme.font.weight.semiBold};
		margin-bottom: ${theme.spacing.tiny};
		margin-top: ${theme.spacing.small};
	`
);

const ListItemAction = styled.button(
	({ theme }) => css`
		color: ${theme.color.primary[0]};
		font-size: ${theme.font.size.medium};
		font-weight: ${theme.font.weight.semiBold};
		margin-bottom: ${theme.spacing.tiny};
		margin-top: ${theme.spacing.small};
	`
);

const ListItemDescription = styled.h2(
	({ theme }) => css`
		color: ${theme.color.primary[0]};
		font-size: ${theme.font.size.small};
		margin-bottom: ${theme.spacing.small};
		margin-top: ${theme.spacing.tiny};
	`
);

interface ListItemProps {
	topLeftItem?: JSX.Element | string | null;
	topRightItem?: JSX.Element | string | null;
	bottomLeftItem?: JSX.Element | string | null;
	bottomRightItem?: JSX.Element | string | null;
}

const Item: React.FC<ListItemProps> = ({ topRightItem, topLeftItem, bottomRightItem, bottomLeftItem, ...rest }) => (
	<Li {...rest}>
		<ListItemTitle>{topLeftItem}</ListItemTitle>
		<ListItemAction>{topRightItem}</ListItemAction>
		<ListItemDescription>{bottomLeftItem}</ListItemDescription>
		<ListItemDescription>{bottomRightItem}</ListItemDescription>
	</Li>
);

const ListItemTitlePlaceholder = styled.span`
	display: block;
	height: 22px;
	width: 100px;
	${placeholderStyles}
`;

const ListItemDescriptionPlaceholder = styled.span`
	display: block;
	height: 15px;
	width: 150px;
	${placeholderStyles}
`;

interface ListItemPlaceholderProps {
	topLeft?: boolean;
	topRight?: boolean;
	bottomLeft?: boolean;
	bottomRight?: boolean;
}

const ItemPlaceholder: React.FC<ListItemPlaceholderProps> = ({
	topLeft = true,
	topRight = true,
	bottomLeft = true,
	bottomRight = true
}) => (
	<Item
		topLeftItem={topLeft ? <ListItemTitlePlaceholder /> : undefined}
		topRightItem={topRight ? <ListItemTitlePlaceholder /> : undefined}
		bottomLeftItem={bottomLeft ? <ListItemDescriptionPlaceholder /> : undefined}
		bottomRightItem={bottomRight ? <ListItemDescriptionPlaceholder /> : undefined}
	/>
);

export const List = {
	Item,
	ItemPlaceholder
};
