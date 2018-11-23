---
layout: post
title: Google Closure Compiler Quickstart
date: 2018-11-19 18:38 -0800
---

A basic quickstart for using Google's Closure Compiler usage with ES6/Node projects.

## Google Closure Compiler

The compiler has a lot of knobs you can turn, go to the wiki for more details:
<https://github.com/google/closure-compiler/wiki/Flags-and-Options>

```bash
# Will run MUCH faster on Linux/OSX as a native binary will be installed by default.
# The installer will choose which installation type is best for your machine (native, JS, Java)
yarn global add google-closure-compiler
```

#### Common Options

| Arg                         | Explanation                                                                                                                                                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module_resolution`         | `NODE` specifies Node modules resolution rules (use both `./` and `node_module` lookup)                                                                                                                                                                        |
| `js`                        | Glob patterns to add files for Closure to know about; we add modules `package.json` files so closure can understand the module structure when importing                                                                                                        |
| `dependency_mode`           | `STRICT` will only include files which are either included in `entry_point` or are included in an import of `entry_point` or an import thereof                                                                                                                 |
| `entry_point`               | The top level files which the compiler should use as entry points; give context for what code is actually going to see the outside world                                                                                                                       |
| `create_source_map`         | If present, a source map will be generated to the path provided                                                                                                                                                                                                |
| `process_common_js_modules` | If present, will process Node.js `require()`/`module.export`/`exports` statements; By default, only supports `goog.require`/`goog.provide` and ES6 `import`/`export`                                                                                           |
| `externs`                   | JS files which outline environment functions that your code calls which will be available at runtime but not during compile (eg. you have a `<script>` which imports jQuery), so `$` will be globally available when script runs, but not during compile time. |
| `generate_exports`          | If present, will parse for `@export` in JSDocs (`/** @export */`) and will export the member                                                                                                                                                                   |

### Simple Compile

The simplest usage of the GCC is to just do a simple build. ie, build compile all of your JS into a single file.

This can actually be more error prone than more advanced compilations because it attempts to compile ALL the JS passed to it.

```bash
google-closure-compiler \
  --module_resolution=NODE \
  --process_common_js_modules \
  --js='node_modules/**/package.json' \
  --js='**.js' \
  --create_source_map="out.js.map" \
  > out.js
```

### Module Level Tree-Shaking

You can enable module level tree shaking on by setting `dependency_mode` to `STRICT` and specifying one or more `entry_point`s.

```bash
google-closure-compiler \
  --module_resolution=NODE \
  --process_common_js_modules \
  --dependency_mode=STRICT \
  --entry_point="main.js" \
  --js='node_modules/**/package.json' \
  --js='**.js' \
  --create_source_map="out.js.map" \
  > out.js
```

### Advanced Mode (Whole Program Optimization)

By setting `--compilation_level` to `ADVANCED` we get the strongest benefit of the Closure compiler. Whole program optimization
and dead code elimination, this will allow the compiler to remove in-module level code which is never used throughout your
codes life as well as remove code without any effects; thereby actually vastly improving the performance of large code bases.

```bash
google-closure-compiler \
  --module_resolution=NODE \
  --process_common_js_modules \
  --compilation_level=ADVANCED \
  --js='node_modules/**/package.json' \
  --js='**.js' \
  --create_source_map="out.js.map" \
  > out.js
```

### Production Build (Module Tree-Shaking & Advanced Mode)

`dependency_mode=STRICT` and `compilation_level=ADVANCED` are not actually disjoint, you can use them individually but
this actually raises the chances for compile errors for ADVANCED mode as there will be many more modules for the compiler
will try and optimize for, some of which may actually conflict with code that you actually want.

eg. `./node_modules/immutable/contrib/cursor/index.js:35: ERROR - Failed to load module "../../"
var Immutable = require('../../');` will be thrown if you have `immutable@^4.0.0-rc.12` in your `node_modules` and don't
have `--dependency_mode=STRICT` set. But will compile fine in STRICT mode due to that file never actually being imported
in the exported files of `immutable`.

```bash
google-closure-compiler \
  --module_resolution=NODE \
  --process_common_js_modules \
  --compilation_level=ADVANCED \
  --dependency_mode=STRICT \
  --entry_point="main.js" \
  --js='node_modules/**/package.json' \
  --js='**.js' \
  --create_source_map="out.js.map" \
  > out.js
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

The officially documented way to export members is to use JSDoc to annotate a member with `/** @export */` and set `--generate_exports` on the compiler.

When the compiler parses this, it will translate this to `goog.exportProperty()` calls; this does mean you need have `google-closure-library`
code available to the compiler at compile time.

```bash
yarn add google-closure-library
```

With that in your node_modules, make sure the code is imported in your `--js` options past to the compiler.

Now which ever members are annotated with the `@export` JSDoc, will get bound in the format of `<memberName>$$module$path$to$script`.
For example, `main.js` in root will end up being `myFunction$$module$main`, `lib/foobar.js` will be `myFunction$module$lib$foobar`.

#### Use `require()` to expose libraries

It is not possible to `@export` members imported via ES6 `import`. To do so, you should bind the lib to variable using Node `require()`.

```javascript
/** @export */
const immutable = require('immutable')
```

OR

```javascript
const immutable = require('immutable')
this['immutable'] = immutable
```
