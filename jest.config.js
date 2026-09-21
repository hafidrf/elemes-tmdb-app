module.exports = {
  preset: '@react-native/jest-preset',
  // The React Native preset only transforms `react-native*` packages. Redux
  // Toolkit's ESM-only dependencies (immer, reselect, …) must be transformed as
  // well, otherwise Jest fails with `SyntaxError: Unexpected token 'export'`.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@reduxjs/toolkit|redux|immer|reselect|@react-navigation)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};
