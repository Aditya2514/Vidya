module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@api': './src/api',
          '@screens': './src/screens',
          '@components': './src/components',
          '@store': './src/store',
          '@types': './src/types',
        },
      },
    ],
  ],
};
