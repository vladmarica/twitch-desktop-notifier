const path = require('path');

const config = {
  mode: 'development',
  resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  watchOptions: {
      poll: true,
      ignored: /node_modules/,
  },
  output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/build/ui'),
  },
  stats: {
      modules: false,
  },
  entry: './src/ui/renderer.tsx',
  module: {
      rules: [
          {
              test: /\.(js|jsx|tsx|ts)$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
          },
          {
              test: /\.svg$/,
              use: [
                  {
                      loader: 'babel-loader',
                  }
              ],
          },
          {
              test: /\.s?css$/,
              exclude: /\.mod\.s?css$/,
              use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader', // compiles Sass to CSS, using Node Sass by default
              ],
          },
          {
              test: /\.mod\.s?css$/,
              use: [
                  'style-loader',
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                      },
                  },
                  'sass-loader', // compiles Sass to CSS, using Node Sass by default
              ],
          },
      ],
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
  }
  return config;
};
