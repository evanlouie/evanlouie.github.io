interface IEulerQuestion {
  question: string;
  answer: () => number;
}

const Euler1: IEulerQuestion = {
  question: `
  If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.
  Find the sum of all the multiples of 3 or 5 below 1000.`,
  answer: () =>
    [...Array(1000)]
      .map((_, index) => index + 1)
      .filter(n => n % 3 === 0 || n % 5 === 0)
      .reduce((sum, n) => sum + n)
};

const Euler2: IEulerQuestion = {
  question: `
  Each new term in the Fibonacci sequence is generated by adding the previous two terms. By starting with 1 and 2, the first 10 terms will be:
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
  By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.`,
  answer: () => {
    const fibonacciGenerator = function*() {
      let [a, b, c] = [1, 2, -1];
      while (true) {
        yield a;
        c = a + b;
        a = b;
        b = c;
      }
    };

    let sum = 0;
    for (const fibonacci of fibonacciGenerator()) {
      if (fibonacci % 2 === 0) {
        sum = sum + fibonacci;
      }
      if (fibonacci > 4000000) {
        break;
      }
    }

    return sum;
  }
};

const Euler3: IEulerQuestion = {
  question: `
  The prime factors of 13195 are 5, 7, 13 and 29.
  What is the largest prime factor of the number 600851475143 ?`,
  answer: () => {
    /**
     * Recursive solution. V8 doesn't support TCO. Breaks on node and most browsers
     */
    const primeFactorsR = (
      n: number,
      factors: Set<number> = new Set(),
      factor = 2
    ): number[] => {
      if (n === 1) {
        return [...factors];
      } else if (n % factor === 0) {
        return primeFactorsR(n / factor, factors.add(factor), factor);
      } else {
        return primeFactorsR(n, factors.add(factor), factor + 1);
      }
    };

    const primeFactors = (
      target: number,
      factors: Set<number> = new Set(),
      factor = 2
    ): number[] => {
      while (target > 1) {
        if (target % factor === 0) {
          factors.add(factor);
          target = target / factor;
        } else {
          factor = factor + 1;
        }
      }
      return [...factors];
    };

    return Math.max(...primeFactors(600851475143));
  }
};

const Euler4: IEulerQuestion = {
  question: `A palindromic number reads the same both ways. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
  Find the largest palindrome made from the product of two 3-digit numbers.`,
  answer: () => {
    const isPalidrome = (n: number): boolean => {
      const asString = n.toString();
      return (
        asString ===
        asString
          .split("")
          .reverse()
          .join("")
      );
    };

    return (
      [...Array(1000)]
        .map((_, x) => [...Array(1000)].map((_, y) => (x + 1) * (y + 1)))
        // .reduce((flattend, numbers): number[] => {
        //   return flattend.concat(numbers);
        // }, [])
        // .reduce((maxPalindrome, number) => {
        //   return number > maxPalindrome && isPalidrome(number)
        //     ? number
        //     : maxPalindrome;
        // }, -1)
        .reduce((maxPalindrome, numbers) => {
          return Math.max(
            ...numbers.concat([maxPalindrome]).filter(n => isPalidrome(n))
          );
        }, -1)
    );
  }
};

const Euler5: IEulerQuestion = {
  question: `2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
  What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?`,
  answer: () => {
    const isDivibleFrom = (
      n: number,
      from: number,
      to: number,
      current?: number
    ): boolean => {
      if (!current) {
        return isDivibleFrom(n, from, to, from);
      } else if (current === to) {
        return n % current === 0;
      } else if (current > to) {
        return n % current === 0 && isDivibleFrom(n, from, to, current - 1);
      } else if (current < to) {
        return n % current === 0 && isDivibleFrom(n, from, to, current + 1);
      } else {
        throw new Error("BAD STATE");
      }
    };

    for (let x = 1; x < Infinity; x++) {
      if (isDivibleFrom(x, 20, 1)) {
        return x;
      }
    }
    throw new Error("No answer found");
  }
};

const Euler6: IEulerQuestion = {
  question: `The sum of the squares of the first ten natural numbers is,
  1^2 + 2^2 + ... + 10^2 = 385
  The square of the sum of the first ten natural numbers is,
  (1 + 2 + ... + 10)^2 = 552 = 3025
  Hence the difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025 − 385 = 2640.
  Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.`,
  answer: () => {
    const sumOfSquares = (n: number): number =>
      [...Array(n)]
        .map((_, index) => Math.pow(index + 1, 2))
        .reduce((sum, square) => sum + square);

    const squareOfSum = (n: number): number =>
      Math.pow(
        [...Array(n)]
          .map((_, index) => index + 1)
          .reduce((sum, num) => sum + num),
        2
      );

    return squareOfSum(100) - sumOfSquares(100);
  }
};
