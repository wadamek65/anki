import 'styled-components';
import { theme } from '../lib/theme';

declare module 'styled-components' {
	type Theme = typeof theme;
	export type DefaultTheme = Theme;
}
