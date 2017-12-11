---
layout: post
title: 'AOTD: Merge Sort'
categories: algorithms
tags: algorithms, distributed, parallel, coffeescript
---

Hard to explain my love for MergeSort. It's easily one of my favourite algorithms for its simplicity and recursive nature; being the closest to a literal "divide & conquer" algorithm you could possibly get to.

# The Algorithm

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
      middleIndex = Math.round(list.length/2)
      left = list[1..middleIndex]
      right = list[middleIndex..list.length]

      # Recurse
      left = @sort(left)
      right = @sort(right)

      # Merge
      return @merge(left, right)
```

# Application

In terms of performance, it becomes pretty apparent that merge sorts biggest weakness (when compared to other sorting algorithms) is that it's sorting is not in-place. Meaning not only will you require extra space/variables to keep of sublists, you lose [Locality of Reference](https://en.wikipedia.org/wiki/Locality_of_reference). Which, when dealing with large datasets, becomes very noticeable.

> But Evan, how can something with such a blaring flaw be one of your favourite algorithms!?!??!!

## _External_ MergeSort

We may have lost locality of reference, but we also gained something fairly unique to merge sort. Scalability. Merge sort is unique in that it easily allows you to dispatch sorting jobs to other processes.

By modifying our base case, we can apply merge sort to arbitrarily large datasets. Datasets which may have even been too large to originally read into memory.

### Distributed / Large Data

In order to get a distributed example working in the browser, we're gonna have to rely on WebWorkers. For a crash course on how they work, take a swing over to my [article on integrating with React](/react-web-worker) or the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

In the following example, we're just going to sort a big array of random numbers ranging from 0-1000000. To do so, we are going to make use of our earlier made MergeSort class and the following WebWorker helper class to allow for multi-threaded execution:

```coffee
# Helper class to hold some static WebWorker functions
class WebWorker
  # evalString is a toString of a function which when eval'd will return a string
  @work: (evalString) ->
    response = "self.onmessage=function(){postMessage(eval((#{evalString})()))}"
    runnable = new Blob([response], type: "text/javascript" )
    worker = new Worker(window.URL.createObjectURL(runnable))
    answer = new Promise (resolve, reject) =>
      worker.onmessage = (messageEvent) => resolve(messageEvent.data)
      worker.onmessageerror = () => reject("Error occured within WebWorker")
    worker.postMessage("Get to work!");
    return await answer
```

And the code to actually create and sort our list:

```coffee
# List of sample data which needs to be sorted
unsortedListOfNumbers = for _ in [1..1000000]
  Math.round(Math.random() * 1000000)

# Partitioned into equal lists using mod
partitions = []
for num, index in unsortedListOfNumbers
  partitionIndex = index % 100
  if not partitions[partitionIndex]? then partitions[partitionIndex] = []
  partitions[partitionIndex].push(num)

# Lambda to call; you can use whatever sorting function you want, but right now i'm just using the buildin `.sort()`
# Note we make it return a string as the message passing API for WebWorkers only allows strings
sort = (list) =>
  # JSON.stringify(list.sort((a, b) => a - b))
  return JSON.stringify(mergeSort(list))

# WIP
if Worker?
  task = () ->
    # WIP
    (list = [1,4,1,2,3,2,5,7543,23434651,1]) ->
      list.sort()
  taskString = task().toString()
  WebWorker.work taskString
  lists = (WebWorker.work((() -> partition.sort()).toString()) for partition in partitions)
else
  console.exception "#{navigator.appVersion} lacks Web Worker support."
  console.info "Web Workers are required to evaluated answers as computation will cause the main window thread to lock"
  alert "Your browser doesn't seem to support Web Workers :-("
```

Now lets explain:

* We created a list of 1000000 random number from 0 - 1000000

WORK IN PROGRESS
