export default function BubbleSort (tracker) {
  var streak
  for (var i = 0; i < tracker.length; i += streak) {
    streak = 1
    for (var j = tracker.length - 1; j > i; j--) {
      if (tracker.compare(j, j - 1) < 0) {
        streak = 1
        tracker.swap(j, j - 1)
      } else streak++
    }
  }
}
