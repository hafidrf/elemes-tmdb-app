module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // React Navigation's `tabBarIcon` / `headerRight` props are render-function
    // based by design, so the "unstable nested component" heuristic does not
    // apply to them.
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
};
