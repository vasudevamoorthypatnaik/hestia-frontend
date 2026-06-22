module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      '@babel/plugin-transform-class-static-block',
      'react-native-reanimated/plugin', // Must be last per Reanimated docs
    ],
    env: {
      test: {
        plugins: ['@babel/plugin-transform-dynamic-import'],
      },
    },
  }
}
