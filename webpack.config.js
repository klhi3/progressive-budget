const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  mode: "develpment",
  entry: {
    app: "./public/index.js",
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].bundle.js"
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: "Transaction App",
      short_name: "Transaction App",
      description: "An application for transaction",
      background_color: "#01579b",
      theme_color: "#ffffff",
      start_url: "/",
      icons: [{
        src: path.resolve("public/icons/icon-192x192.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("", "icons")
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
module.exports = config;