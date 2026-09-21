module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        allowlist: ['TMDB_READ_ACCESS_TOKEN', 'TMDB_API_KEY'],
        quiet: true,
      },
    ],
  ],
};
