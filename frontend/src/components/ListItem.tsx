import * as React from 'react';
import styled from 'styled-components';

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
	topLeftItem?: JSX.Element | string;
	topRightItem?: JSX.Element | string;
	bottomLeftItem?: JSX.Element | string;
	bottomRightItem?: JSX.Element | string;
}

export const ListItem = (props: ListItemProps) => (
	<Item>
		<ListItemTitle>{props.topLeftItem}</ListItemTitle>
		<ListItemAction>{props.topRightItem}</ListItemAction>
		<ListItemDescription>{props.bottomLeftItem}</ListItemDescription>
		<ListItemDescription>{props.bottomRightItem}</ListItemDescription>
	</Item>
);
