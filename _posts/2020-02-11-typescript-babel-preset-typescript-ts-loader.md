---
layout: post
title: TypeScript -- @babel/preset-typescript & ts-loader
date: 2020-02-11 03:50 -0800
---

There are several ways to compile your TypeScript projects nowadays. You can use
a vanilla call to `tsc` to just convert everything to `.js` files, or you can
use a build tool like `webpack` and use a TypeScript loader like `ts-loader` or
Babels `@babel/preset-typescript`

Here are a couple example `webpack.config.js` files to configure said loaders
for Webpack to compile a Node project into a single JS file.

## @babel/preset-typescript

```sh
yarn add -D webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-typescript
```

```js
// webpack.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                ["@babel/preset-env", { targets: { node: "8" } }],
                [
                  "@babel/preset-typescript",
                  { isTSX: true, allExtensions: true }
                ]
              ]
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "compiled.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

### Pros

- FAST! Because Babel only does code transforms, the build step becomes
  incredibly fast as it skips the type-checking step and just strips out the all
  the TypeScript type-annotations -- converting it to vanilla JS.

### Cons

- No type-safety at build time! -- you have to make sure you project compiles
  properly to ensure type-safety. I've often ended up writing `package.json`
  build commands that end up looking like the following to get around it:
  ```json
  "scripts": {
    "build": "tsc && webpack"
  }
  ```

## ts-loader

```sh
yarn add -D webpack webpack-cli babel-loader @babel/core @babel/preset-env ts-loader
```

```js
// webpack.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [["@babel/preset-env", { targets: { node: "8" } }]]
            }
          },
          "ts-loader"
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "compiled.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

### Pros

- Type-safety at build time!

### Cons

- Can be pretty slow
