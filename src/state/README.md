# State

The basic shape for the state will be as follows:

```js
{
  values: [0.4, 0.2, 0.6, 0.8, 1],
  algorithm: 'BUBBLE_SORT',
  currentMove: 1,
  moves: [
    {
      type: 'MOVE_START',
      payload: {
        algorithm: 'BUBBLE_SORT',
        values: [0.4, 0.2, 0.6, 0.8, 1]
      }
    },
    {
      type: 'MOVE_COMPARE',
      payload: {
        i: 0,
        j: 1,
        result: -1
      }
    },
    {
      type: 'MOVE_SWAP',
      payload: {
        i: 0,
        j: 1
      }
    }
  ]
}
```

There will be a few action creators that will only call other actions. For
example, the doNextMove action creator will be used with redux thunk to return a
promise for the next move (obtained from the state) being done. The next move
itself will be a separate action, dispatched as a side effect of doNextMove.
