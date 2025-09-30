// babel.config.js
module.exports = function (api) {
  // cache once; don't combine with api.env()
  api.cache(true);

  // Jest sets NODE_ENV=test
  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: { '@': './' },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }],
      // disable reanimated plugin during tests (we mock it in jest.setup)
      !isTest && 'react-native-reanimated/plugin',
    ].filter(Boolean),
  };
};
