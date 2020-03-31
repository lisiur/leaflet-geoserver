const path = require('path')

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
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
}