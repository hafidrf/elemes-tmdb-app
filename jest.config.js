module.exports = {
  preset: '@react-native/jest-preset',
  // The React Native preset only transforms `react-native*` packages. Redux
  // Toolkit's ESM-only dependencies (immer, reselect, …), the navigation stack
  // and the icon font package all ship untranspiled source, so they must be
  // transformed as well, otherwise Jest fails with `SyntaxError: Unexpected
  // token 'export'`.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-vector-icons|@reduxjs/toolkit|redux|immer|reselect|@react-navigation)/)',
  ],
  // Ionicons requires its .ttf at import time and Jest cannot parse a font.
  // FastImage is a native view, so it is swapped for a mock that renders a plain
  // RN Image instead of trying to resolve a host component.
  moduleNameMapper: {
    '\\.(ttf|otf|woff2?|eot)$': '<rootDir>/__mocks__/fontMock.js',
    '^@d11/react-native-fast-image$': '<rootDir>/__mocks__/fastImageMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};
