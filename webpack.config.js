module.exports = {
  entry: './index.js',
  output: {
    filename: './bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }
};
