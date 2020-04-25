import * as React from 'react';
import styled, { css } from 'styled-components';

import { placeholderStyles } from '../lib/styles';

const Item = styled.li(
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

export const ListItem: React.FC<ListItemProps> = ({
	topRightItem,
	topLeftItem,
	bottomRightItem,
	bottomLeftItem,
	...rest
}) => (
	<Item {...rest}>
		<ListItemTitle>{topLeftItem}</ListItemTitle>
		<ListItemAction>{topRightItem}</ListItemAction>
		<ListItemDescription>{bottomLeftItem}</ListItemDescription>
		<ListItemDescription>{bottomRightItem}</ListItemDescription>
	</Item>
);

const ListItemTitlePlaceholder = styled.span(
	({ theme }) => css`
		height: 22px;
		width: 100px;
		margin-bottom: ${theme.spacing.tiny};
		margin-top: ${theme.spacing.small};
		${placeholderStyles}
	`
);

const ListItemDescriptionPlaceholder = styled.span(
	({ theme }) => css`
		height: 15px;
		width: 150px;
		margin-bottom: ${theme.spacing.small};
		margin-top: ${theme.spacing.tiny};
		${placeholderStyles}
	`
);

interface ListItemPlaceholderProps {
	topLeft?: boolean;
	topRight?: boolean;
	bottomLeft?: boolean;
	bottomRight?: boolean;
}

export const ListItemPlaceholder: React.FC<ListItemPlaceholderProps> = ({
	topLeft = true,
	topRight = true,
	bottomLeft = true,
	bottomRight = true
}) => (
	<Item>
		{topLeft ? <ListItemTitlePlaceholder /> : <span />}
		{topRight ? <ListItemTitlePlaceholder /> : <span />}
		{bottomLeft ? <ListItemDescriptionPlaceholder /> : <span />}
		{bottomRight ? <ListItemDescriptionPlaceholder /> : <span />}
	</Item>
);
