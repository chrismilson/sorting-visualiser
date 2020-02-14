# State

The basic shape for the state will be as follows:

```js
{
  values: [1, 0.4, 0.6, 0.8, 0.2],
  algorithm: 'Bubble Sort',
  currentMove: {
    type: 'swap',
    i: 0,
    j: 1
  },
  moveGenerator: BubbleSortGenerator
}
```