import * as React from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { ErrorBoundary } from './containers/ErrorBoundary';
import { UserInfo } from './containers/UserInfo';
import { environment } from './lib/relay';
import { theme } from './lib/theme';

const GlobalStyle = createGlobalStyle`
	body {
		background-color: ${props => props.theme.color.background};
		font-family: Montserrat, sans-serif;
		font-size: ${props => props.theme.font.size.regular};
		margin: 0;
		min-width: 200px;
	}
	
	button, hr, a, input, ul, li, h1, h2 {
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
						<React.Suspense fallback={<h1>Loading ...</h1>}>
							<UserInfo />
						</React.Suspense>
					</ErrorBoundary>
				</>
			</ThemeProvider>
		</RelayEnvironmentProvider>
	);
};
