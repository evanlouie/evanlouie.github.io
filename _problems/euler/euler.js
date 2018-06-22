"use strict";
const Euler1 = {
    question: `
  If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.
  Find the sum of all the multiples of 3 or 5 below 1000.`,
    answer: () => [...Array(1000)]
        .map((_, index) => index + 1)
        .reduce((sum, n) => (n % 3 === 0 || n % 5 === 0 ? sum + n : sum))
};
const Euler2 = {
    question: `
  Each new term in the Fibonacci sequence is generated by adding the previous two terms. By starting with 1 and 2, the first 10 terms will be:
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
  By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.`,
    answer: () => {
        const fibonacciGenerator = function* () {
            let [a, b, c] = [1, 2, 3];
            while (true) {
                yield a;
                c = a + b;
                a = b;
                b = c;
            }
        };
        const answerRecursive = (sum = 0, sequence = fibonacciGenerator(), fibonacci = 0) => fibonacci > 4000000
            ? sum
            : answerRecursive(sum + fibonacci, sequence, sequence.next().value);
        const answer = (sum = 0) => {
            for (const fibonacci of fibonacciGenerator()) {
                if (fibonacci > 4000000) {
                    break;
                }
                else {
                    sum = sum + fibonacci;
                }
            }
            return sum;
        };
        return answer();
    }
};
const Euler3 = {
    question: `
  The prime factors of 13195 are 5, 7, 13 and 29.
  What is the largest prime factor of the number 600851475143 ?`,
    answer: () => {
        /**
         * Recursive solution. V8 doesn't support TCO. Breaks on node and most browsers
         */
        const primeFactorsRecursive = (n, factors = new Set(), factor = 2) => n === 1
            ? [...factors]
            : n % factor === 0
                ? primeFactorsRecursive(n / factor, factors.add(factor), factor)
                : primeFactorsRecursive(n, factors.add(factor), factor + 1);
        const primeFactors = (target, factors = new Set(), factor = 2) => {
            while (target > 1) {
                if (target % factor === 0) {
                    factors.add(factor);
                    target = target / factor;
                }
                else {
                    factor = factor + 1;
                }
            }
            return [...factors];
        };
        return Math.max(...primeFactors(600851475143));
    }
};
const Euler4 = {
    question: `A palindromic number reads the same both ways. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
  Find the largest palindrome made from the product of two 3-digit numbers.`,
    answer: () => {
        const isPalidrome = (n) => typeof n !== "string"
            ? isPalidrome(n.toString())
            : n ===
                n
                    .split("")
                    .reverse()
                    .join("");
        return Math.max(...[...Array(1000)]
            .map((_, x) => [...Array(1000)].map((_, y) => (x + 1) * (y + 1)))
            .reduce((palindromes, numbers) => palindromes.concat(numbers.filter(isPalidrome))));
    }
};
const Euler5 = {
    question: `2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
  What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?`,
    answer: () => {
        const isDivibleFrom = (n, from, to, current) => !current
            ? isDivibleFrom(n, from, to, from)
            : current === to
                ? n % current === 0
                : current > to
                    ? n % current === 0 && isDivibleFrom(n, from, to, current - 1)
                    : n % current === 0 && isDivibleFrom(n, from, to, current + 1);
        /**
         * Recursive answer
         * @param current
         */
        const answerRecursive = (current = 1) => isDivibleFrom(current, 20, 1) ? current : answerRecursive(current + 1);
        const answer = () => {
            for (let x = 1; x < Infinity; x++) {
                if (isDivibleFrom(x, 20, 1)) {
                    return x;
                }
                else {
                    continue;
                }
            }
            throw new Error("No answer found");
        };
        return answer();
    }
};
const Euler6 = {
    question: `The sum of the squares of the first ten natural numbers is,
  1^2 + 2^2 + ... + 10^2 = 385
  The square of the sum of the first ten natural numbers is,
  (1 + 2 + ... + 10)^2 = 552 = 3025
  Hence the difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025 − 385 = 2640.
  Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.`,
    answer: () => {
        const sumOfSquares = (n) => [...Array(n)]
            .map((_, index) => Math.pow(index + 1, 2))
            .reduce((sum, square) => sum + square);
        const squareOfSum = (n) => Math.pow([...Array(n)]
            .map((_, index) => index + 1)
            .reduce((sum, num) => sum + num), 2);
        return squareOfSum(100) - sumOfSquares(100);
    }
};
const Euler7 = {
    question: `
  By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.
  What is the 10 001st prime number?`,
    answer: () => {
        /**
         * Primes are defined as numbers not being evenly divisible by any primes lesser than itself
         */
        const primesGenerator = function* () {
            const primes = [];
            let current = 2;
            while (true) {
                if (!primes.find(prime => current % prime === 0)) {
                    yield current;
                    primes.push(current);
                }
                current = current + 1;
            }
        };
        let count = 1;
        for (const prime of primesGenerator()) {
            if (count === 10001) {
                return prime;
            }
            else {
                count = count + 1;
            }
        }
        throw new Error("Answer not found");
    }
};
