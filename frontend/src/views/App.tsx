import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createGlobalStyle, css, ThemeProvider } from 'styled-components';

import { relayEnvironment } from '../lib/relay';
import { theme } from '../lib/theme';
import { Login } from './Login';
import { Main } from './Main';
import { Deck } from './Main/Deck';
import { DeckList } from './Main/DeckList';
import { Study } from './Main/Study';
import { StudySession } from './Main/StudySession';
import { Profile } from './Main/Profile';

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
		th,
		tr,
		td,
		progress,
		textarea {
			all: unset;
		}
	`
);

export const App: React.FC = () => {
	return (
		<RelayEnvironmentProvider environment={relayEnvironment}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<>
						<GlobalStyle />
						<Routes>
							<Route path="/login" element={<Login />} />
						</Routes>
						<Routes>
							<Route path="/" element={<Main />}>
								<Route path="profile" element={<Profile />} />
								<Route path="decks" element={<DeckList />} />
								<Route path="decks/:deckId/*" element={<Deck />} />
								<Route path="study/:deckId" element={<Study />} />
								<Route path="study/session/:sessionId" element={<StudySession />} />
							</Route>
						</Routes>
					</>
				</ThemeProvider>
			</BrowserRouter>
		</RelayEnvironmentProvider>
	);
};
