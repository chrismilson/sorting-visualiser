# Sorting Visualiser

A simple visualisation tool for some well known sorting algorithms.

This is a rewrite of the original, which was a react app. This version has
several differences:

- The original was developed with ReactJS, and had some overhead costs
  associated with that. This version is written with basic js so those overheads
  are gone.

- The original used window.setInterval for timing the canvas renders, this
  version uses window.requestAnimationFrame.

- The implementation of the original used generators to act as an iterator on
  the states of the sorting. This had several setbacks:
  
  - The memory overhead was immense.
  - We could only evolve in the forward direction.
  - We could not distinguish between different types of operations in the sort
    (comparison, swapping values, reading and setting values to and from
    memory).
  
  This version instead implements the sorting algorithms with an API for these
  operations, so each algorithm cannot directly interact with the data.

  When the APIs are called, the operation is recorded and pushed to a history of
  operations which is then navigated while rendering.

  This has one setback in that the extra memory required is directly
  proportional to the number of steps, so for inefficient algorithms on large
  data, the memory overhead can be quite large. This memory is only read during
  animation though so it is still much faster than the old version's generators.

The main reason I decided to not use react was [this
video](https://www.youtube.com/watch?v=7Rrv9qFMWNM), on web workers and running
off the main thread. This app runs on the main thread but I was trying to strip
down the unneeded excess of my app.