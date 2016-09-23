import {AbstractEulerProblem} from "./AbstractEulerProblem";

/**
 * @link https://projecteuler.net/problem=1
 */
export default class EulerProblem1 extends AbstractEulerProblem {

  problemNumber = 1;
  question = `
  If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.

  Find the sum of all the multiples of 3 or 5 below 1000.`;

  // Check if a number is a multiple of 3 or 5 using mod operator
  isMultipleOf3or5(n: number): boolean {
    return n % 3 === 0 || n % 5 === 0;
  }

  // Iterate up from 0 to 999 with a running sum if divisible by 3 or 5
  answer() {
    let sum: number = 0;
    for (let n = 0; n < 1000; n++) {
      if (this.isMultipleOf3or5(n)) {
        sum += n;
      }
    }

    return sum.toString();
  }
}
