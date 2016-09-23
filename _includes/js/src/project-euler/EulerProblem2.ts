/**
 * @link https://projecteuler.net/problem=2
 */

import {AbstractEulerProblem} from "./AbstractEulerProblem";

export default class EulerProblem2 extends AbstractEulerProblem {

  problemNumber = 2;
  question = `
  Each new term in the Fibonacci sequence is generated by adding the previous two terms. By starting with 1 and 2, the first 10 terms will be:

  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...

  By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.`;

  memory: number[] = [];

  // Find the nth Fibonacci number
  fib(n: number): number {
    // No negative nth Fibonacci number
    if (n <= 2) {
      this.memory[n] = n;
    }
    // Memoize
    if (typeof this.memory[n] === "undefined") {
      this.memory[n] = this.fib(n - 1) + this.fib(n - 2);
    }

    return this.memory[n];
  }

  // Check to see if the first 10 Fibonacci numbers match what"s defined in the question
  fibTest(): boolean {
    let matches: boolean = false;
    const fibs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => this.fib(n));

    // As defined by question
    return fibs.toString() === [1, 2, 3, 5, 8, 13, 21, 34, 55, 89].toString();
  }

  // Iterate up from fib(n)<=4000000 and calculate running sum if fib(n) is even
  answer() {
    let runningSum: number = 0;
    for (let n: number = 0; this.fib(n) <= 4000000; n++) {
      // If even; add
      if (this.fib(n) % 2 === 0) {
        runningSum = runningSum + this.fib(n);
      }
    }

    return runningSum.toString();
  }
}
