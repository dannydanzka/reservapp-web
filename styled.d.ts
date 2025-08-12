import 'styled-components';

import { theme } from './src/libs/presentation/styles/theme';

type Theme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
