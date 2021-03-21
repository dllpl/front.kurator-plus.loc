var path = require('path');

module.exports = {
  publicPath: './',
  lintOnSave: false,
  runtimeCompiler: true,
  devServer: {
    host: process.env.HOST,
    https: Boolean(process.env.HTTPS),
    port: process.env.PORT
  },
  chainWebpack: config => {
    config.resolve.alias.set('~views', path.resolve(__dirname, 'src/views'));
    config.resolve.alias.set('~plugin', path.resolve(__dirname, 'src/plugin'));
    config.resolve.alias.set('~gql', path.resolve(__dirname, 'src/graphql'));
    config.resolve.alias.set('~classes', path.resolve(__dirname, 'src/classes'));
    config.module.rule('eslint').set({
      enforce: 'pre',
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    })
  }
};
