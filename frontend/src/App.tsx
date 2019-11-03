import { Router } from '@reach/router';
import * as React from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { environment } from './lib/relay';
import { theme } from './lib/theme';
import { Navbar } from './components/Navbar/Navbar';
import { Decks } from './containers/Decks';
import { ErrorBoundary } from './containers/ErrorBoundary';

const GlobalStyle = createGlobalStyle`
	body {
		background-color: ${props => props.theme.color.background};
		font-family: Montserrat, sans-serif;
		font-size: ${props => props.theme.font.size.regular};
		margin: 0;
		min-width: 200px;
	}
	
	button, hr, a, input, ul, li, h1, h2, img {
		all: unset;
	}
	`;

export const App = () => {
	return (
		<RelayEnvironmentProvider environment={environment}>
			<ThemeProvider theme={theme}>
				<>
					<GlobalStyle />
					<ErrorBoundary>
						<Navbar />
						<Router>
							<Decks path={'/'} />
						</Router>
					</ErrorBoundary>
				</>
			</ThemeProvider>
		</RelayEnvironmentProvider>
	);
};
