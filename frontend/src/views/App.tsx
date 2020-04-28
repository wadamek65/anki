import { ApolloClient, ApolloProvider, concat, HttpLink, InMemoryCache, ServerError } from '@apollo/client';
import { onError } from '@apollo/link-error';
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createGlobalStyle, css, ThemeProvider } from 'styled-components';

import { API_URL } from '../lib/config';
import { relayEnvironment } from '../lib/relay';
import { theme } from '../lib/theme';
import { Login } from './Login';
import { Main } from './Main';
import { Card, Deck, DeckList } from './Main/views';
import { ErrorBoundary } from '../components/ErrorBoundary';

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

const logoutLink = onError(({ networkError }) => {
	if ((networkError as ServerError)?.statusCode === 401) {
		window.location.replace('/login');
	}
});

const httpLink = new HttpLink({ uri: `${API_URL}/graphql`, credentials: 'include' });

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(logoutLink as any, httpLink)
});

export const App: React.FC = () => {
	return (
		<BrowserRouter>
			<ApolloProvider client={apolloClient}>
				<ThemeProvider theme={theme}>
					<>
						<GlobalStyle />
						<Routes>
							<Route path={'/login'} element={<Login />} />
						</Routes>
						<ErrorBoundary>
							<RelayEnvironmentProvider environment={relayEnvironment}>
								<Routes>
									<Route path={'/'} element={<Main />}>
										<Route path={'decks/'} element={<DeckList />} />
										<Route path={'decks/:deckId/'} element={<Deck />} />
										<Route path={'decks/:deckId/cards/:cardId'} element={<Card />} />
									</Route>
								</Routes>
							</RelayEnvironmentProvider>
						</ErrorBoundary>
					</>
				</ThemeProvider>
			</ApolloProvider>
		</BrowserRouter>
	);
};
