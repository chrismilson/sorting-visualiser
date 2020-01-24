# Sorts

Each sorting algorithm is implemented with access to a tracker API, and does not
have direct access to the values it is sorting. The tracker API supplies some
useful methods for inferring information about the values that the sorting
algorithms can use to virually sort the data.

As the algorithm accesses the tracker API, the API will monitor and record each
access as a 'move'. These moves will form a list of the entire history of the
sort. This means that the algorithms are quite easy to read as they do not have
to maintain state like an iterator version of the algorithm might.

## Naming

Each algorithm should have a 'title' attribute that is intended to be used as a
high level identifier for the sort. This will be the tag in the menu where the
algorithm is chosen.