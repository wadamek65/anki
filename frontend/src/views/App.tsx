import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, concat, ApolloLink } from '@apollo/client';
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle, css, ThemeProvider } from 'styled-components';

import { theme } from '../lib/theme';
import { Auth, TOKEN_KEY } from './Main/components/Auth';
import { MobileNav } from './Main/components/Nav';
import { Card, Deck, DeckCards, DeckList } from './Main/views';
import { RouteContainer } from './Main/views/elements';
import { API_URL } from '../lib/config';

const GlobalStyle = createGlobalStyle(
	({ theme }) => css`
		body {
			background-color: ${theme.color.background};
			font-family: Montserrat, sans-serif;
			font-size: ${theme.font.size.regular};
			margin: 0;
			min-width: 200px;
		}

		button,
		hr,
		a,
		input,
		ul,
		li,
		h1,
		h2,
		img,
		textarea {
			all: unset;
		}
	`
);

const httpLink = new HttpLink({ uri: API_URL });
const authMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext({
		headers: {
			'x-access-token': localStorage.getItem(TOKEN_KEY)
		}
	});

	return forward(operation);
});

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware, httpLink)
});

export const App: React.FC = () => {
	return (
		<ApolloProvider client={apolloClient}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<>
						<GlobalStyle />
						<Auth>
							<MobileNav />
							<Routes>
								<Route path={'/decks/'} element={<DeckList />} />
								<Route path={'/decks/'} element={<RouteContainer />}>
									<Route path={':deckId/'} element={<Deck />}>
										<Route path={'cards/'} element={<DeckCards />} />
										<Route path={'cards/:cardId/'} element={<Card />} />
									</Route>
								</Route>
							</Routes>
						</Auth>
					</>
				</ThemeProvider>
			</BrowserRouter>
		</ApolloProvider>
	);
};
