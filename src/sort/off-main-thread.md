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
- Transfer the alculated result to the main thread.

The third and final step here is important; If we used the standard pattern of
structural cloning, then the main thread would still stall. We must *transfer*
ownership of the calculated steps object to the main thread.

When a sort is run, it takes a single argument, the `Tracker` object, that it
will modify to build a sequence of steps to sort/unsort the array that the given
`Tracker` represents. 

We instantiate a `Tracker` on the main thread to represent the current state of
the values. We then transfer ownership of this `Tracker` to the worker thread.
The worker then runs the sort, advancing the `Tracker` and building the sequence
of moves. Finally, when the sort has completed the worker will return ownership
of the `Tracker` and we will continue on the main thread.
