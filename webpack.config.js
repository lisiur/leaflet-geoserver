const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

function resolvePath(...args) {
  return path.resolve(__dirname, ...args)
}

module.exports = {
  entry: resolvePath('src/leaflet-geoserver.ts'),
  output: {
    path: resolvePath('dist'),
    filename: 'leaflet-geoserver.js',
    library: 'LG',
    libraryTarget: 'umd',
  },
  externals: {
    leaflet: 'L'
  },
  module: {
    rules: [
      {
        test: /\.js|\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  plugins: [
    new CopyPlugin([
      {from: resolvePath('src/typings'), to: resolvePath('dist/types/typings')},
    ])
  ],
}