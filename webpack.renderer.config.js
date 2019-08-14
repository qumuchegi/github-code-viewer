const rules = require('./webpack.rules');
var path = require('path')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

rules.push({
  test: /\.less$/,
  use: [
    { loader: 'style-loader' }, 
    { loader: 'css-loader' },
    {
      loader: 'less-loader',
      options: {
        modifyVars: {
          'primary-color': '#1296db',
        },
        javascriptEnabled: true
      }
    }
  ]
})

rules.push(
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    include: [path.resolve(__dirname, 'src/render')],
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', "@babel/preset-react"],
        plugins: ['@babel/plugin-proposal-object-rest-spread']
      }
    }
  }
)

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }
  
};
