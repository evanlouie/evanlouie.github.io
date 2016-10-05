---
layout: post
title: Language Performance Tests - Nth Fibonacci
excerpt: 'One of the most common interview questions also happens to be a good measure of performance for differing languages. With a whole bunch of different ways to implement it, calculating the nth Fibonacci number can both reveal strengths/weaknesses of languages as optimizations become easier or more difficult (possibly impossible) to implement.'
---

<https://github.com/evanlouie/fibonacci-performance>

One of the most common interview questions also happens to be a good measure of performance for differing languages.

With a whole bunch of different ways to implement it, calculating the nth Fibonacci number can both reveal strengths/weaknesses of languages as optimizations become easier or more difficult (possibly impossible) to implement.

# Calculating the 42nd Fibonacci number

---

Language         | Style              | Time
---------------- | ------------------ | ------------
Ruby (2.3.1p112) | Recursive          | 12.163913
                 | Recursive/Memoized | 00.000063
                 | Tail Recursive     | 00.000014
                 | Iterative          | 00.000015
Crystal (0.19.3) | Recursive          | 20.0241730
                 | Recursive/Memoized | 00.0000270
                 | Tail Recursive     | 00.0000140
                 | Iterative          | 00.0000120
Node (6.7.0)     | Recursive          | 00.976164
                 | Recursive/Memoized | 00.000408
                 | Tail Recursive     | 00.000221
                 | Iterative          | 00.000162
Go (1.7.1)       | Recursive          | 81.471789461
                 | Recursive/Memoized | 00.00002876
                 | Tail Recursive     | 00.000007418
                 | Iterative          | 00.000007196

# Takeaways

I was extremely surprised by the findings of this basic test. I expected Ruby to be the slowest by a large margin with Go and Crystal being magnitudes faster and Node falling behind them. Node being only faster than Ruby in the recursive solution shows that Ruby can in fact hold up quite well for CPU intensive tasks. What I was not expecting was the implementation of BigInt in Crystal and Go to be so expensive. More specifically in the recursive solution to them. I tried replicate the algorithms as closely as possible for all languages. As such, I did not implement any sort of variadic functions for Int32, Int64, and BigInt, and just chose to default to BigInt as the dynamic languages did not require such implementation.

I was amazed at the performance optimizations Ruby has done in terms of autoscaling its number type. Without actually doing any explicit typing, Ruby's number type management is optimized enough to stay competitive with Crystal and to Go in the basic case.

# Caveats

---

- This is an EXTREMELY dumb performance test. Meaning that I only really wanted to see how the languages would perform when I tried to transfer the same code from language to language without any sort of optimizations. Because of this, I default to the BigInt type for Go and Crystal.
- A test using variadic functions to optimize between Int32/Int64/BigInt would most definitely make Go and Crystal leagues faster. I also wouldn't be surprised if this performance measure changed drastically as Go and Crystal optimize there BigInt implementations.
- I chose the number 42 simply because any higher and the recursive solutions for Ruby, Crystal, and Go because unbearably slow. Crystal and Go's memoized/tail-recursive/iterative solutions would most definitely be much faster with a very large `n` (>100000)
- It should be noted that given a large number, Ruby and Crystal's tail-recursive solutions will still fail; neither language languages does proper tail call optimization.
