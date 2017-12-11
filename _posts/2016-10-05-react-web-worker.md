---
layout: post
title: 'React & Web Workers'
tags: react web-workers node javascript browser multi-thread multi-process
excerpt: 'One of the less well known or used features of modern browsers is Web Worker support. With it, you can use spin up isolated processes to do CPU intensive tasks without locking the windows main rendering thread.'
---

One of the less well known or used features of modern browsers is Web Worker support. With it, you can spin up isolated processes to do CPU intensive tasks without locking the windows main rendering thread.

# The Problem

Want an example? Just try to run this code in your browsers console... Its my solution to [Problem 5](https://github.com/evanlouie/project-euler/blob/master/src/lib/EulerProblem5.ts) of [Project Euler](https://projecteuler.net/problem=5)

```javascript
(function(){for(var e=function(e,t,n){for(var o=!0,r=t;r<=n;r++)e%r!==0&&(o=!1);return o},t=0,n=0;0===t;)n++,e(n,1,20)&&(t=n);return t.toString()})()
```

Feel that lag? Feel your browser lock up? Yup, thats because the your browser window runs in a single threaded event loop. This event loop is why Node.js and Javascript in general is considered "fast". But you must not forget that its only "fast" for IO bound applications. Anything CPU bound/intensive will not yield itself to any other task and will thus act sequentially in the event loop; and for a browser window, where rendering occurs in the main thread, means a lock.

# The Solution

Now, go to <https://www.evanlouie.com/project-euler/> and click the "Answer" button for problem 5.

Notice anything? Notice how your browser was still active and didn't lock up? this is because of Web Workers!

A Web Worker (or just Worker if your from Node land) is the JS solution to multi-processing. Node and Browsers are asynchronous in nature. Browsers Javascript engines are built from the ground up to be event-driven, with Node and Chrome in particular being based on libuv. This means that the main thread will naturally spin up additional threads for blocking code (such as IO ops), enqueue a callback/promise on to the event queue, and continue on its marry way with non blocking code.

In the example above, we executed non blocking CPU intensive code in your browser window. Thus the event loop was rendered useless and the main thread kept busy until execution completed.

Web Workers allow you to spin up additional processes and have them communicate with each other with a standard messaging API. In the case of Web Workers, all you'll really need to know is the `postMessage` function, which is what the Worker should call on the event of receiving a message.

In the example below, I have defined the code to be run as the variable `answer`, an anonymous function which is COMPLETELY isolated; meaning everything it needs to run is within the function itself. Helper functions are defined within the lambda itself.

Here is where things get tricky/weird. Web Workers were meant to execute code on an DIFFERENT URL from the one your currently on. To get around this, you're going to have to do some weird (pronounced "hacky") stuff.

---

- Define the `self.onmessage` event as the `postMessage` of the `eval` for `answer`; all of which is saved as a string.
- Instantiate a `Blob` with a `text/javascript` type and the onmessage string as its body; do note that the string has to be stored in an array. Hence `[response]`
- You can then bind the blob to the window under an object URL using `window.URL.createObjectURL` and thus instantiate a Worker from it
- Define what the main window should do when receiving a message from the worker with `worker.onmessage`
- Tell the worker to get to work with `worker.postMessage`

```javascript
const answer =  () => {
    const isDivisible = (n, from, to) => {
        let divisible = true;
        for (let x = from; x <= to; x++) {
            if (n % x !== 0) {
                divisible = false;
            }
        }
        return divisible;
    };
    let smallestPositive = 0;
    let currentNumber = 0;
    while (smallestPositive === 0) {
        currentNumber++;
        if (isDivisible(currentNumber, 1, 20)) {
            smallestPositive = currentNumber;
        }
    }
    return smallestPositive.toString();
};

// Check for Web Worker support in browser
if (typeof Worker !== "undefined") {
    const response = `self.onmessage=function(){postMessage(eval((${answer})()))}`; // Wrap workers onmessage lambda
    const runnable = new Blob([response], { type: "text/javascript" }); // Make a runnable JS blob
    const worker = new Worker(window.URL.createObjectURL(runnable)); // Bind the runnable blob to the a URL and create a worker
    worker.onmessage = (e) => {
        console.log("Received: " + e.data); // Log the response from the worker
    };
    worker.postMessage("WORK!!!"); // Start the worker.
} else {
    console.exception(`${navigator.appVersion} lacks Web Worker support.`);
    console.info("Web Workers are required to evaluated answers as computation will cause the main window thread to lock");
    alert("Your browser doesn't seem to support Web Workers :-(");
}
```

And there you have it! Multi-Process Javascript!

Their aren't that many use cases for such JS as it you shouldn't be doing such heavy CPU lifting on the client or with Node in general. But if you ever find yourself needing to crank out some number work in the browser, this is how (_•̀ᴗ•́_)و ̑̑

For a more in-depth look at how to implement this into your React app, take a swing over to <https://github.com/evanlouie/project-euler/blob/master/src/components/Problem.tsx> and <https://github.com/evanlouie/project-euler/blob/master/src/lib/EulerProblem5.ts> to take a closer look at how I implemented it for <https://www.evanlouie.com/project-euler/>

Happy Coding~ Go and wreak some CPU havoc from the browser ୧༼✿ ͡◕ д ◕͡ ༽୨
