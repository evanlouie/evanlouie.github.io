/**
 * @link https://projecteuler.net/problem=3
 */

import {AbstractEulerProblem} from "./AbstractEulerProblem";

export default class EulerProblem3 extends AbstractEulerProblem {

  problemNumber = 3;
  question = `
  The prime factors of 13195 are 5, 7, 13 and 29.

  What is the largest prime factor of the number 600851475143 ?`;

  /**
   * Find primeness of a number
   * @link https://en.wikipedia.org/wiki/Prime_number#Trial_division
   */
  isPrime(n: number): boolean {
    let start = 2;
    while (start <= Math.sqrt(n)) {
      if (n % start++ < 1) {
        return false;
      }
    }
    return n > 1;
  }

  // iterate down from 600851475143 and return the first n where isPrime
  answer() {
    let largestPrime = 3;
    for (let n = 600851475143; n > 0; n--) {
      if (this.isPrime(n)) {
        largestPrime = n;
        break;
      }
    }

    return largestPrime.toString();
  }
}
