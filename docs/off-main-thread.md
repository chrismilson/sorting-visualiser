# Sorting Off the Main Thread

When calculating a sort, the main thread is blocked, and no user interaction
will be processed until the sort has finished calculating.

This can cause problems. Sorts with high runtime complexity (bubble sort for
example) can take a long time to finish on large data sets (more than a second)
which can cause the interface to seem laggy.

The idea then, is to implent a [web
worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) that
will:

- Be instantiated by the main thread after page load.
- Calculate the results of any sort or unsort.
- Transfer the calculated result to the main thread.

When a sort is run, it takes a single argument, the `Tracker` object, that it
will modify to build a sequence of steps to sort/unsort the array that the given
`Tracker` represents. The worker will instantiate the tracker object, calculate
the moves, and then respond to the main thread with the moves and the resultant
array. The resultant array will be used by the unsorting algorithms. This way we
can start calculating a sort before the unsort has finished animating.

# How do we transfer?

Only certain objects can be transfered between the main thread and worker
threads. The `Move` objects that we were using when calcluating just on the main
thread are not transferrable either. We must reimplement the `Move` objects in
such a way that we can still use them in a friendly, easy-to-read manner, but so
that they are transferrable between the worker and the main thread.

The way I have decided to do this is with the `Typed`
