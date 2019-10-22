# Quick Sort

Quick sort is similar to merge sort in that it is a divide and conquer
algorithm.

Quick sort runs on a subarray of a given array by the following process:

1. Choose a ***pivot***.
1. Rearrange the subarray so that all elements smaller than the pivot are on 
    the left of the pivot and all larger elements are on the right.
1. Run recursively on the new portions.

There are different ways to choose the pivot, each giving a different looking
quick sort