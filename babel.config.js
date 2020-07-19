/* eslint-disable */
module.exports = {
  "presets": [
      ["@babel/preset-env",  
          {
              "useBuiltIns": "usage",
              "corejs": 3,
              "targets": "defaults and not ie >= 0 and last 2 versions and not dead"
          }
      ],
      "@babel/preset-typescript",
      "@babel/preset-react"
  ],
  "plugins": []
};
