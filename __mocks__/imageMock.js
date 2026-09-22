// Jest has no asset pipeline, so `require('...png')` resolves here instead.
// Mapped in jest.config.js. React Native's Image accepts a number as a local
// asset reference, which is all a test needs to render one.
module.exports = 1;
