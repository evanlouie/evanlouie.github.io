---
layout: post
title: Google Closure Quickstart
date: 2018-11-19 18:38 -0800
---

A basic quickstart for using Google's Closure Compiler usage with ES6/Node projects.

### Google Closure Compiler

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

### Exposing functions (JS Interop)

#### Easiest & Cleanest

Bind to a global variable using string literals; As Closure never touches string literals, doing dictionary bindings on global
objects will export the function as expected.

##### NodeJS - Bind to `this`

This method seems to be undocumented and I only discovered it by playing around.

```javascript
const myFunction = () => {
  console.log("I do something");
};
const anotherFunction = () => {
  console.log("I do more!");
};
this["myFunction"] = myFunction;
this["anotherFunction"] = anotherFunction;
```

When compiled in `ADVANCED`, the outputted JS, when `require()`'d will return an object with `myFunction` and `anotherFunction` keys;
Both with the expected functions.

##### Browser - Bind to `window`

If you are compiling for the browser, the simplest way is to just bind to `window` instead of `this`

#### Official & Unclear

The officially documented way to export members is to use JSDoc to annotate a member with `/** @export */`.

When the compiler parses this, it will translate this to `goog.exportProperty()` calls; this does mean you need have `google-closure-library`
code available to the compiler at compile time.

```bash
yarn add google-closure-library
```

With that in your node_modules, make sure the code is imported in your `--js` options past to the compiler.

Now which ever members are annotated with the `@export` JSDoc, will get bound in the format of `<memberName>$$module$path$to$script`.
For example, `main.js` in root will end up being `myFunction$$module$main`, `lib/foobar.js` will be `myFunction$module$lib$foobar`.
