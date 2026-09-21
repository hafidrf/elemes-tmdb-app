// Jest runs without a native FastImage module, so the
// `@d11/react-native-fast-image` import resolves here instead (mapped in
// jest.config.js). It renders the plain RN Image so a test can still read the
// source off the tree, and it carries the same static helpers as the real module
// so component code that touches `FastImage.priority` etc. still works.
const React = require('react');
const { Image } = require('react-native');

const priority = { low: 'low', normal: 'normal', high: 'high' };
const cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };
const resizeMode = { contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center' };
const transition = { fade: 'fade', none: 'none' };

const FastImage = ({ source, style, resizeMode: mode = 'cover', onError, ...rest }) =>
  React.createElement(Image, { source, style, resizeMode: mode, onError, ...rest });

FastImage.priority = priority;
FastImage.cacheControl = cacheControl;
FastImage.resizeMode = resizeMode;
FastImage.transition = transition;
FastImage.preload = () => {};
FastImage.clearMemoryCache = () => Promise.resolve();
FastImage.clearDiskCache = () => Promise.resolve();

module.exports = FastImage;
