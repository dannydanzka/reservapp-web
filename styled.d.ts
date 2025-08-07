import 'styled-components';

import { Theme } from './src/libs/ui/styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    // This ensures the interface is not empty
    __brand?: 'styled-components-theme';
  }
}
