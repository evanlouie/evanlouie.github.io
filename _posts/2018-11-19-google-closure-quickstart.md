---
layout: post
title: Google Closure Quickstart
date: 2018-11-19 18:38 -0800
---

### Google Closure Compiler

A basic quickstart for using Google's Closure Compiler for general ES6 projects.

The compiler has a lot of knobs you can turn, go to the wiki for more details: https://github.com/google/closure-compiler/wiki/Flags-and-Options

```bash
# Will run MUCH faster on Linux/OSX as a native binary will be installed by default.
# The installer will choose which installation type is best for your machine (native, JS, Java)
yarn global add google-closure-compiler
```

#### Simple Compile w/ Tree-Shaking

| Arg                 | Explanation                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module_resolution` | `NODE` specifies Node modules resolution rules (use both `./` and `node_module` lookup)                                                                 |
| `js`                | Glob patterns to add files for Closure to know about; we add modules `package.json` files so closure can understand the module structure when importing |
| `dependency_mode`   | `STRICT` will only include files which are either included in `entry_point` or are included in an import of `entry_point` or an import thereof          |
| `entry_point`       | The top level files which the compiler should use as entry points; give context for what code is actually going to see the outside world                |

```bash
google-closure-compiler \
  --module_resolution=NODE \
  --dependency_mode=STRICT \
  --js='node_modules/**/package.json' \
  --js='**.js' \
  --entry_point="main.js"
```

### Advanced Mode (Whole Program Optimization)

By setting `--compilation_level` to `ADVANCED` we get the best strongest benefit of the Closure compiler. Whole program optimization
and dead code elimination.

```bash
google-closure-compiler \
  --module_resolution=NODE \
  --dependency_mode=STRICT \
  --compilation_level=ADVANCED \
  --js='node_modules/**/package.json' \
  --js='**.js' \
  --entry_point="main.js"
```
