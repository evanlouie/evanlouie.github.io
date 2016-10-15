---
layout: post
title: 'AOTD: Merge Sort'
---

Hard to explain my love for MergeSort. It's easily one of my favourite algorithms for its simplicity and recursive nature; being the closest to a literal "divide & conquer" algorithm you could possibly get to.

# The Algorithm

<https://en.wikipedia.org/wiki/Merge_sort>

Merge sort is probably the easiest sorting algorithm to wrap you mind around:

---

- A list of size 1 or 0 is sorted
- Recursively divide the unsorted list into two unsorted lists until the two unsorted lists become sorted (by definition of an empty or single element list being sorted)
- Merge the sorted lists

```javascript
function merge(a, b) {
    const result = [];

    // merge the two sorted lists  
    while (a.length > 0 && b.length > 0) {
        if (a[0] <= b[0]) {
            result.push(a.shift());
        } else {
            result.push(b.shift());
        }
    }

    // a or b may have 1 sorted list left in them
    while (a.length > 0) {
        result.push(a.shift());
    }
    while (b.length > 0) {
        result.push(b.shift());
    }

    return result;
}

function mergeSort(list = []) {
    // base case - empty or 1 item == already sorted
    if (list.length <= 1) {
        return list;
    } else {
        let left = [];
        let right = [];

        // divide - save space by using splice to remove values in place of the original array
        list.forEach((value, index) => {
            if (index + 1 <= list.length / 2) {
                left.push(value);
            } else {
                right.push(value);
            }
        });

        // recursively divide until base case
        left = mergeSort(left);
        right = mergeSort(right);

        // conquer
        return merge(left, right);
    }
}
```

# Application

In terms of performance, it becomes pretty apparent that merge sorts biggest weakness (when compared to other sorting algorithms) is that it's sorting is not in-place. Meaning not only will you require extra space/variables to keep of sublists, you lose [Locality of Reference](https://en.wikipedia.org/wiki/Locality_of_reference). Which, when dealing with large datasets, becomes very noticeable.

> But Evan, how can something with such a blaring flaw be one of your favourite algorithms!?!??!!

## *External* MergeSort

We may have lost locality of reference, but we also gained something fairly unique to merge sort. Scalability. Merge sort is unique in that it easily allows you to dispatch sorting jobs to other processes.

By modifying our base case, we can apply merge sort to arbitrarily large datasets. Datasets which may have even been too large to originally read into memory.

### Distributed

*Coming Soon*

### Large Data  

*Coming Soon*
