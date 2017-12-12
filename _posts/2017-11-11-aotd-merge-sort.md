---
layout: post
title: 'AOTD: (External) Merge Sort'
categories: algorithms
tags: algorithms distributed parallel coffeescript
---

Hard to explain my love for MergeSort. It's easily one of my favourite algorithms for its simplicity and recursive nature; being the closest to a literal "divide & conquer" algorithm you could possibly get to.

## The Algorithm

<https://en.wikipedia.org/wiki/Merge_sort>

Merge sort is probably the easiest sorting algorithm to wrap you mind around:

---

* A list of size 1 or 0 is sorted
* Recursively divide the unsorted list into two unsorted lists until the two unsorted lists become sorted (by definition of an empty or single element list being sorted)
* Merge the sorted lists

```coffee
class MergeSort
  @merge: (a, b) =>
    # merge the two sorted lists
    sorted = while a.length > 0 or b.length > 0
      # If both still have items
      if a[0]? and b[0]?
        if a[0] <= b[0] then a.shift() else b.shift()
      # either a or b may still have items
      else if a[0]? then a.shift()
      else if b[0]? then b.shift()

    return sorted

  @sort: (list) =>
    if list.length <= 1
      return list
    else
      # Split into 2 halves
      middleIndex = Math.round(list.length / 2)
      left = list[0...middleIndex]
      right = list[middleIndex..list.length]

      # Recurse
      left = @sort(left)
      right = @sort(right)

      # Merge
      return @merge(left, right)
```

## Application

In terms of performance, it becomes pretty apparent that merge sorts biggest weakness (when compared to other sorting algorithms) is that it's sorting is not in-place. Meaning not only will you require extra space/variables to keep of sublists, you lose [Locality of Reference](https://en.wikipedia.org/wiki/Locality_of_reference). Which, when dealing with large datasets, becomes very noticeable.

> But Evan, how can something with such a blaring flaw be one of your favourite algorithms!?!??!!

### _External_ MergeSort

We may have lost locality of reference, but we also gained something fairly unique to merge sort. Scalability. Merge sort is unique in that it easily allows you to dispatch sorting jobs to other processes.

By modifying our base case, we can apply merge sort to arbitrarily large datasets. Datasets which may have even been too large to originally read into memory.

#### Distributed / Large Data

In order to get a distributed example working in the browser, we're gonna have to rely on WebWorkers. For a crash course on how they work, take a swing over to my [article on integrating with React](react-web-worker) or the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

In the following example, we're just going to sort a big array of random numbers ranging from 0-1000000. To do so, we are going to make use of a modified version of our earlier made MergeSort class and the following WebWorker helper class to allow for multi-threaded execution:

```coffee
class WebWorker
  # evalString is a toString of a function which when eval'd will return a string
  @eval: (evalString) =>
    response = "self.onmessage=()=>{postMessage(eval((#{evalString})))}"
    runnable = new Blob([response], type: "text/javascript" )
    worker = new Worker(window.URL.createObjectURL(runnable))
    answer = new Promise (resolve, reject) =>
      worker.onmessage = (messageEvent) =>
        resolve(messageEvent.data)
      worker.onmessageerror = () =>
        reject("Error occured within WebWorker")
    worker.postMessage("Get to work!");
    return await answer

class ExternalMergeSort
  @merge: (a, b) =>
    console.info "Merging: ", a, b

    # Callable lambda
    mergeTask = (a ,b) =>
      # merge the two sorted lists
      merged = while a.length > 0 or b.length > 0
        # If both still have items
        if a[0]? and b[0]?
          if a[0] <= b[0] then a.shift() else b.shift()
        # either a or b may still have items
        else if a[0]? then a.shift()
        else if b[0]? then b.shift()

      return merged

    # Interpolate callable into string with .call()
    merged = await WebWorker.eval("(#{mergeTask}).call(this, [#{a}], [#{b}])")

    console.info "Merged: ", merged
    return merged

  @sort: (list, targetListSize = 1000) =>
    if list.length < targetListSize
      sortingTask = (list) => list.sort (a, b) => a - b
      sorted = await WebWorker.eval("(#{sortingTask}).call(this, [#{list}])")
      console.info "Sorted: ", sorted
      return sorted
    else
      middleIndex = Math.round(list.length / 2)
      left = list[0...middleIndex]
      right = list[middleIndex..list.length]

      # await Promise.all() to allow allow jobs to fire concurrently
      merged = await Promise.all([@sort(left), @sort(right)]).then ([left, right]) =>
          return @merge(left, right)

      return merged

randomNumbers = for _ in [1..1000000]
  Math.round(Math.random() * 1000000)

ExternalMergeSort.sort(randomNumbers).then (sorted) =>
  console.log("Done: ", sorted)
  sorted
```

Now lets explain:

* We created a list of 1000000 random numbers from 0 - 1000000.
* We modified the code in `MergeSort` to `ExternalMergeSort` which trigger calls to `WebWorker` instead of doing the `merge` and `sort` locally.

And there it is, a quasi-distributed MergeSort. Don't go trying to use this in any practical scenario. `Array.sort()` will be infinitly faster and more space efficient. This is a POC to show how external mergesort would work in the context of a browser. In order to get any actual usefulness out External MergeSort, you would need to either need to have complex computation for a comparitor in `sort` or require parsing of data to big to fit into memory; neither of which can be fulfilled by a list of 1000000 random numbers.

## Final Takeaways

* MergeSort is simple, relatively fast, and incredibly easy to scale out if necessary.
* External MergeSort is good for scenarios which require high computation for comparing list items and for when the list size is too big to read into memory.
* Don't use WebWorkers like I did in this demo.
