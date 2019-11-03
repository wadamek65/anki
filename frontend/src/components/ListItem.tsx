import * as React from 'react';
import styled from 'styled-components';

import { placeholderStyles } from '../lib/styles';

const Item = styled.li(({ theme }) => ({
	alignItems: 'center',
	borderTop: `1px solid ${theme.color.gray.disabled}`,
	display: 'grid',
	gridColumn: '1 / -1',
	gridTemplateColumns: '1fr 1fr',
	padding: '0 8px',
	'&:last-child': {
		borderBottom: `1px solid ${theme.color.gray.disabled}`
	}
}));

const ListItemTitle = styled.h1(({ theme }) => ({
	color: theme.color.gray.dark,
	fontSize: theme.font.size.medium,
	fontWeight: theme.font.weight.semiBold,
	marginBottom: theme.spacing.tiny,
	marginTop: theme.spacing.small
}));

const ListItemAction = styled.button(({ theme }) => ({
	color: theme.color.primary.dark,
	fontSize: theme.font.size.medium,
	fontWeight: theme.font.weight.semiBold,
	marginBottom: theme.spacing.tiny,
	marginTop: theme.spacing.small
}));

const ListItemDescription = styled.h2(({ theme }) => ({
	color: theme.color.primary.dark,
	fontSize: theme.font.size.small,
	marginBottom: theme.spacing.small,
	marginTop: theme.spacing.tiny
}));

interface ListItemProps {
	topLeftItem?: JSX.Element | string | null;
	topRightItem?: JSX.Element | string | null;
	bottomLeftItem?: JSX.Element | string | null;
	bottomRightItem?: JSX.Element | string | null;
}

export const ListItem = (props: ListItemProps) => (
	<Item>
		<ListItemTitle>{props.topLeftItem}</ListItemTitle>
		<ListItemAction>{props.topRightItem}</ListItemAction>
		<ListItemDescription>{props.bottomLeftItem}</ListItemDescription>
		<ListItemDescription>{props.bottomRightItem}</ListItemDescription>
	</Item>
);

const ListItemTitlePlaceholder = styled.span`
	height: 22px;
	width: 100px;
	margin-bottom: ${props => props.theme.spacing.tiny};
	margin-top: ${props => props.theme.spacing.small};
	${placeholderStyles}
`;

const ListItemDescriptionPlaceholder = styled.span`
	height: 15px;
	width: 150px;
	margin-bottom: ${props => props.theme.spacing.small};
	margin-top: ${props => props.theme.spacing.tiny};
	${placeholderStyles}
`;

interface ListItemPlaceholderProps {
	topLeft?: boolean;
	topRight?: boolean;
	bottomLeft?: boolean;
	bottomRight?: boolean;
}

export const ListItemPlaceholder = ({
	topLeft = true,
	topRight = true,
	bottomLeft = true,
	bottomRight = true
}: ListItemPlaceholderProps) => (
	<Item>
		{topLeft ? <ListItemTitlePlaceholder /> : <span />}
		{topRight ? <ListItemTitlePlaceholder /> : <span />}
		{bottomLeft ? <ListItemDescriptionPlaceholder /> : <span />}
		{bottomRight ? <ListItemDescriptionPlaceholder /> : <span />}
	</Item>
);
