---
layout: post
title: React-Redux-Typescript2-Webpack2 Boilerplate Example
---

Recently a colleague of mine wanted to migrate one of our React apps from just using a Babel for compiling ES6/7 to using TypeScript as well (strict-null types in TypeScript2 was just too good to not have). Having used TypeScript for a few React apps in the past, I realized there were quite a few oddities when actually explaining what what to do when migrating the app. In particular, its usage with Redux.

<https://www.evanlouie.com/react-redux-typescript-webpack-boilerplate/>

# Visual Components

The [react-redux documentation](http://redux.js.org/docs/basics/UsageWithReact.html) will describe a difference between a `visual` and `container` component. The former being what you would be what you normally think of in terms of a React component; and the latter being a Redux aware container to act as a bridge between the Redux store and dispatcher, and your visual component.

In the docs, you'll see visual components defined only as functions:

```
import React, { PropTypes } from 'react';

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Todo
```

Now, although this is a matter of personal preference, we could do something like this in TypeScript and just add parameter types to the function; but I feel we lose a lot of the structure that we gain from a ES6 React class and TypeScripts generics for component props.

So if we do end up making a react component class, well end up writing something that looks like this (this is an example from my boilerplate repo)

```javascript
import * as React from "react";

export interface IGreetingProps {
    greeting: string;
    including: string[];
    jokes: string[];
    onAddMessage: (message: string) => any;
    getAnotherJoke: () => void;
}

interface IGreetingsLocalState {
    feature: string;
}

export default class Greeting extends React.Component<IGreetingProps, IGreetingsLocalState> {
  // Random stuff in here
}
```

# Container Components

The container component is component which just acts as a wrapper for you visual components and talks to Redux.

They are composed of two functions, `mapStateToProps` and `mapDispatchToProps`. `mapStateToProps` takes in the global redux state and reduces it to the bare minimum needed to render your visual component. Thus removing the need to implement `shouldComponentUpdate`, as the passed props are always up to date and the minimum needed. `mapDispatchToProps` returns wrapper functions for `dispatch()`, as we don't want our component dispatching actions directly and giving good separation of concerns.

One of the core features of react-redux is that by writing your containers using the `connect()` generator, you don't have to implement `shouldComponentUpdate` to optimize your visual components. But the `connect` function expects to two parameters which are merged together to create your props for your component:

```javascript
const mapStateToProps = (state: any): any => {
    return {
        greeting: state.greetings.greeting,
        including: state.greetings.including,
        jokes: state.greetings.jokes,
    };
};
const mapDispatchToProps = <T>(dispatch: Redux.Dispatch<T>): any => {
    return {
        getAnotherJoke: () => {
            dispatch(Actions.getRandomChuckNorrisJoke());
        },
        onAddMessage: (message: string) => {
            dispatch(Actions.addMessage(message));
        },
    };
};

const Homepage = connect(mapStateToProps, mapDispatchToProps)(Greeting);

export default Homepage;
```

If you write something like this, TypeScript is gonna yell at you saying `connect(mapStateToProps, mapDispatchToProps)` doesn't match the propTypes for `Greeting`. This is because we've had to coerce the return values from `mapStateToProps` and `mapDispatchToProps` to `any`.

# Intersect Types & Generics To The Rescue

The TypeScript `React.Component` class defines itself as a generic that takes in a `<P,S>`. The former being your props interface and the latter your state. In order to properly integrate with react-redux, you need to be able to compose your props from two separate objects. Luckily for us, TypeScript supports generics and allows us to compose types as intersects of other types using the `&` operator.

```javascript
export interface IGreetingState {
    greeting: string;
    including: string[];
    jokes: string[];
}
export interface IGreetingActions {
    onAddMessage: (message: string) => any;
    getAnotherJoke: () => void;
}
interface IGreetingsLocalState {
    feature: string;
}
export default class Greeting extends React.Component<IGreetingState & IGreetingActions, IGreetingsLocalState
```

The above snippet now fulfills the class signature of `Component<P,S>` by defining `P` as the the intersect of `IGreetingState` and `IGreetingActions`.

Now lets change the types of `mapStateToProps` and `mapDispatchToProps` to reflect these new interfaces:

```javascript
const mapStateToProps = (state: any): IGreetingState => {
    return {
        greeting: state.greetings.greeting,
        including: state.greetings.including,
        jokes: state.greetings.jokes,
    };
};
const mapDispatchToProps = <T>(dispatch: Redux.Dispatch<T>): IGreetingActions => {
    return {
        getAnotherJoke: () => {
            dispatch(Actions.getRandomChuckNorrisJoke());
        },
        onAddMessage: (message: string) => {
            dispatch(Actions.addMessage(message));
        },
    };
};

const Homepage = connect(mapStateToProps, mapDispatchToProps)(Greeting);
```

Voila! `connect(mapStateToProps, mapDispatchToProps)` now satisfies the type constraints of `Greeting`!

For a more in-depth look at how to write a react/redux app with TypeScript, head over to my [boilerplate repo](https://github.com/evanlouie/react-redux-typescript-webpack-boilerplate) for some sample code.

Happy Coding! and my the types be with you ᕕ( ᐛ )ᕗ
