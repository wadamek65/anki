import { ApolloClient, ApolloProvider, concat, HttpLink, InMemoryCache, ServerError } from '@apollo/client';
import { onError } from '@apollo/link-error';
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle, css, ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router';

import { theme } from '../lib/theme';
import { Card, Deck, DeckCards, DeckList } from './Main/views';
import { RouteContainer } from './Main/views/elements';
import { API_URL } from '../lib/config';
import { Login } from './Login';
import { Main } from './Main';

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

const ApolloApp: React.FC = () => {
	const navigate = useNavigate();
	const logoutLink = onError(({ networkError }) => {
		if ((networkError as ServerError)?.statusCode === 401) {
			navigate('/login');
		}
	});

	const httpLink = new HttpLink({ uri: `${API_URL}/graphql`, credentials: 'include' });

	const apolloClient = new ApolloClient({
		cache: new InMemoryCache(),
		link: concat(logoutLink as any, httpLink)
	});

	return (
		<ApolloProvider client={apolloClient}>
			<ThemeProvider theme={theme}>
				<>
					<GlobalStyle />
					<Routes>
						<Route path={'/login'} element={<Login />} />
						<Route path={'/'} element={<Main />}>
							<Route path={'decks/'} element={<DeckList />} />
							<Route path={'decks/'} element={<RouteContainer />}>
								<Route path={':deckId/'} element={<Deck />}>
									<Route path={'cards/'} element={<DeckCards />} />
									<Route path={'cards/:cardId/'} element={<Card />} />
								</Route>
							</Route>
						</Route>
					</Routes>
				</>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export const App: React.FC = () => (
	<BrowserRouter>
		<ApolloApp />
	</BrowserRouter>
);
