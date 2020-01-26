module.exports = {
  comments: true,
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 6,
          browsers: ['> 0.5%', 'last 2 versions'],
        },
      },
    ],
  ],
  plugins: [
    [
      '@babel/transform-runtime',
      {
        regenerator: true,
        helpers: true,
        corejs: 2,
      },
    ],
    '@babel/proposal-class-properties',
  ],
}
