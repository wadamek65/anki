import 'styled-components';
import { theme } from '../lib/theme';

declare module 'styled-components' {
	type Theme = typeof theme;
	interface DefaultTheme extends Theme {} // eslint-disable-line @typescript-eslint/no-empty-interface
}
