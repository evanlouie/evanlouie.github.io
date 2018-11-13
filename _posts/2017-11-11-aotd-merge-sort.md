---
layout: post
title: "AOTD: (External) Merge Sort"
categories: algorithms
tags: algorithms distributed parallel coffeescript
---

Hard to explain my love for MergeSort. It's easily one of my favourite algorithms for its simplicity and recursive nature; being the closest to a literal "divide & conquer" algorithm you could possibly get to.

## The Algorithm

<https://en.wikipedia.org/wiki/Merge_sort>

Merge sort is probably the easiest sorting algorithm to wrap you mind around:

---

- A list of size 1 or 0 is sorted
- Recursively divide the unsorted list into two unsorted lists until the two unsorted lists become sorted (by definition of an empty or single element list being sorted)
- Merge the sorted lists

```typescript
class MergeSort {
  public static sort<T = any>(list: T[]): T[] {
    if (list.length <= 1) {
      return list;
    } else {
      const middleIndex = Math.round(list.length / 2);
      const left = this.sort(list.slice(0, middleIndex));
      const right = this.sort(list.slice(middleIndex, list.length - 1));

      return this.merge<T>(left, right);
    }
  }

  private static merge<T>(a: T[], b: T[]): T[] {
    const sorted = [];
    while (a.length > 0 || b.length > 0) {
      if (a[0] && b[0]) {
        if (a[0] <= b[0]) {
          sorted.push(a.shift());
        } else {
          sorted.push(b.shift());
        }
      } else if (a[0]) {
        sorted.push(a.shift());
      } else if (b[0]) {
        sorted.push(b.shift());
      }
    }
    return sorted;
  }
}
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

```typescript
class WebWorker {
  public static async eval<T = any>(string: string): Promise<T> {
    const response = `self.onmessage=()=>{postMessage(eval((${string})))}`;
    const runnable = new Blob([response], { type: "text/javascript" });
    const worker = new Worker(URL.createObjectURL(runnable));
    const answer = new Promise<T>((resolve, reject) => {
      worker.onmessage = messageEvent => resolve(messageEvent.data);
      worker.onerror = () => reject("Error within worker");
    });
    worker.postMessage("Get to work!");
    return answer;
  }
}

class ExternalMergeSort {
  public static async sort<T>(
    list: T[],
    maxListSize: number = 1000
  ): Promise<T[]> {
    console.info("Sorting:", list);
    if (list.length <= maxListSize) {
      const sortingTask = (l: T[]) => l.sort();
      const sorted = await WebWorker.eval(
        `(${sortingTask}).call(null, [${list}])`
      );
      console.info("Sorted:", sorted);
      return sorted;
    } else {
      const middleIndex = Math.round(list.length / 2);
      const left = list.splice(0, middleIndex);
      const right = list;
      const sortedLists = await Promise.all<T[], T[]>([
        this.sort<T>(left),
        this.sort<T>(right)
      ]);
      const merged = await this.merge(sortedLists[0], sortedLists[1]);
      console.info("Sorted:", merged);
      return merged;
    }
  }

  private static async merge<T>(l1: T[], l2: T[]): Promise<T[]> {
    console.info("Merging:", l1, l2);
    const mergeTask = (a: T[], b: T[]) => {
      const merged: T[] = [];
      while (a.length > 0 || b.length > 0) {
        if (a[0] && b[0]) {
          if (a[0] <= b[0]) {
            merged.push(a.shift());
          } else {
            merged.push(b.shift());
          }
        } else if (a[0]) {
          merged.push(a.shift());
        } else if (b[0]) {
          merged.push(b.shift());
        }
      }
      return merged;
    };

    const merged: T[] = await WebWorker.eval(
      `(${mergeTask}).call(null, [${l1}], [${l2}])`
    );
    console.info("Merged:", merged);
    return merged;
  }
}

const randomNumbers: number[] = Array(10000)
  .fill(undefined)
  .map(() => Math.round(Math.random() * 100000));
ExternalMergeSort.sort(randomNumbers).then(sorted =>
  console.info("Done:", sorted)
);
```

Now lets explain:

- We created a list of 1000000 random numbers from 0 - 1000000.
- We modified the code in `MergeSort` to `ExternalMergeSort` which trigger calls to `WebWorker` instead of doing the `merge` and `sort` locally.

And there it is, a quasi-distributed MergeSort. Don't go trying to use this in any practical scenario. `Array.sort()` will be infinitly faster and more space efficient. This is a POC to show how external mergesort would work in the context of a browser. In order to get any actual usefulness out External MergeSort, you would need to either need to have complex computation for a comparitor in `sort` or require parsing of data to big to fit into memory; neither of which can be fulfilled by a list of 1000000 random numbers.

## Final Takeaways

- MergeSort is simple, relatively fast, and incredibly easy to scale out if necessary.
- External MergeSort is good for scenarios which require high computation for comparing list items and for when the list size is too big to read into memory.
- Don't use WebWorkers like I did in this demo.
