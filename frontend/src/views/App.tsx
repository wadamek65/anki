import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle, css, ThemeProvider } from 'styled-components';

import { theme } from '../lib/theme';
import { Auth } from './Main/components/Auth';
import { MobileNav } from './Main/components/Nav';
import { Card, Deck, DeckCards, DeckList } from './Main/views';
import { RouteContainer } from './Main/views/elements';

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

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: 'http://localhost:4000/graphql'
	})
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
