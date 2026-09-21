const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Gradle leaves native build output inside node_modules (android/build,
    // android/.cxx) and rewrites it while a build runs. Metro crawls
    // node_modules by default, so it would walk those trees too, which makes
    // the file map huge and unstable. With a build running alongside it, the
    // dev server has crashed on a missing CMake temp dir. Nothing under those
    // paths is ever bundled as JS.
    blockList: [
      /.*[/\\]node_modules[/\\].*[/\\]android[/\\]\.cxx[/\\].*/,
      /.*[/\\]node_modules[/\\].*[/\\]android[/\\]build[/\\].*/,
      /.*[/\\]node_modules[/\\].*[/\\]ios[/\\]build[/\\].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
