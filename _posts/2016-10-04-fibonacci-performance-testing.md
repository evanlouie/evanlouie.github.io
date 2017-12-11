---
layout: post
title: Language Performance Tests - Nth Fibonacci
tags: ruby php node crystal go performance fibonacci functional recursion
excerpt: 'One of the most common interview questions also happens to be a good measure of performance for differing languages. With a whole bunch of different ways to implement it, calculating the nth Fibonacci number can both reveal strengths/weaknesses of languages as optimizations become easier or more difficult (possibly impossible) to implement.'
---

<https://github.com/evanlouie/fibonacci-performance>

One of the most common interview questions also happens to be a good measure of performance for differing languages.

With a whole bunch of different ways to implement it, calculating the nth Fibonacci number can both reveal strengths/weaknesses of languages as optimizations become easier or more difficult (possibly impossible) to implement.

# Calculating the 42nd Fibonacci Number

---

Language         | Style              | Time
---------------- | ------------------ | ---------------------
Ruby (2.3.1p112) | Recursive          | 12.163913
                 | Recursive/Memoized | 00.000063
                 | Tail Recursive     | 00.000014
                 | Iterative          | 00.000015
PHP (5.6)        | Recursive          | 82.052486181259
                 | Recursive/Memoized | 00.00017690658569336
                 | Tail Recursive     | 00.000020027160644531
                 | Iterative          | 00.000016927719116211
Node (6.7.0)     | Recursive          | 00.976164
                 | Recursive/Memoized | 00.000408
                 | Tail Recursive     | 00.000221
                 | Iterative          | 00.000162
Crystal (0.19.3) | Recursive          | 20.0241730
                 | Recursive/Memoized | 00.0000270
                 | Tail Recursive     | 00.0000140
                 | Iterative          | 00.0000120
Go (1.7.1)       | Recursive          | 81.471789461
                 | Recursive/Memoized | 00.00002876
                 | Tail Recursive     | 00.000007418
                 | Iterative          | 00.000007196

# Calculating the 1000th Fibonacci Number

---

Language         | Style          | Time
---------------- | -------------- | -------------------
Ruby (2.3.1p112) | Memoized       | 0.001242
                 | Tail Recursive | 0.000675
                 | Iterative      | 0.000603
PHP (5.6)        | Recursive      | 0.028115034103394
                 | Tail Recursive | 0.00032591819763184
                 | Iterative      | 0.00013184547424316
Node (6.7.0)     | Memoized       | 0.006424
                 | Tail Recursive | 0.000249
                 | Iterative      | 0.000187
Crystal (0.19.3) | Memoized       | 0.0028400
                 | Tail Recursive | 0.0003290
                 | Iterative      | 0.0001250
Go (1.7.1)       | Memoized       | 0.000830915
                 | Tail Recursive | 0.000302451
                 | Iterative      | 0.000243935

# Calculating the 10000th Fibonacci Number

---

Language         | Style          | Time
---------------- | -------------- | ------------------
Ruby (2.3.1p112) | Memoized       | Stack Overflow
                 | Tail Recursive | Stack Overflow
                 | Iterative      | 0.007262
PHP (5.6)        | Recursive      | 2.5333361625671
                 | Tail Recursive | 0.0018389225006104
                 | Iterative      | 0.0046770572662354
Node (6.7.0)     | Memoized       | 0.009359
                 | Tail Recursive | 0.000904
                 | Iterative      | 0.000447
Crystal (0.19.3) | Memoized       | 0.0167490
                 | Tail Recursive | 0.0059720
                 | Iterative      | 0.0035250
Go (1.7.1)       | Memoized       | 0.011767574
                 | Tail Recursive | 0.006467878
                 | Iterative      | 0.004209375

# Takeaways

I was extremely surprised by the findings of this basic test. I expected Ruby to be the slowest by a large margin with Go and Crystal being magnitudes faster and Node falling behind them:

---

- Ruby handles big numbers VERY well. Although getting a stack overflow with `n > 10000`, I'm sure that one could increase it's stack size to make the memoized and tail-recursive solutions work just as well. Was able to return the 10000th fib without any BigNum implementation.
- PHP held up as I expected. Solid performance for a dynamic language, however it should be noted that I did not implement the solution with GMPMP or BCMath. Only with PHP's standard numbers. So with the 10000th test, `infinity` was returned. I am curious to see how PHP7 compares.
- Node is overall quite fast for a dynamic language, as one would expect from the V8 engine. As with PHP, I did implement the solution with any BigNum implementation. So infinity was returned for the 10000th test.
- Crystal held up quite well as expected
- Go was unexpectedly slower than Crystal for the tail-recursive and iterative solutions. This leads me to think Go's BigInt implementation is slower overall than Crystals, however their internal reference handling and map/hash management is better (as the memoized solution shows)

What I was not expecting was the implementation of BigInt in Crystal and Go to be so expensive. More specifically in the recursive solution to them. I tried replicate the algorithms as closely as possible for all languages. As such, I did not implement any sort of variadic functions for Int32, Int64, and BigInt, and just chose to default to BigInt as the dynamic languages did not require such implementation.

I was amazed at the performance optimizations Ruby has done in terms of autoscaling its number type. Without actually doing any explicit typing, Ruby's number type management is optimized enough to stay competitive with Crystal and to Go in the basic case.

# Caveats

---

- This is an EXTREMELY dumb performance test. Meaning that I only really wanted to see how the languages would perform when I tried to transfer the same code from language to language without any sort of optimizations. Because of this, I default to the BigInt type for Go and Crystal.
- A test using variadic functions to optimize between Int32/Int64/BigInt would most definitely make Go and Crystal leagues faster. I also wouldn't be surprised if this performance measure changed drastically as Go and Crystal optimize there BigInt implementations.
- I chose the number 42 simply because any higher and the recursive solutions for Ruby, Crystal, and Go because unbearably slow. Crystal and Go's memoized/tail-recursive/iterative solutions would most definitely be much faster with a very large `n` (>100000)
- It should be noted that given a large number, Ruby and Crystal's tail-recursive solutions will still fail; neither language does proper tail call optimization.
