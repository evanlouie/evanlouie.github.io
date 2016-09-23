import EulerProblem1 from "./project-euler/EulerProblem1";
import EulerProblem2 from "./project-euler/EulerProblem2";
import EulerProblem3 from "./project-euler/EulerProblem3";

const p1 = new EulerProblem1().printExecutionTime();
const p2 = new EulerProblem2().printExecutionTime();
const p3 = new EulerProblem3().printExecutionTime();



import * as React from "react";
import * as ReactDOM from "react-dom";

import Hello from "./components/Hello";

let mounts = document.querySelectorAll(".mount");
Array.prototype.slice.call(mounts).forEach((element: Element) => {
  ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    element
  );
});


