# Library Documentation
## Table of Contents

1. [MyTools](#mytools)
2. [sha](#sha)

## MyTools 
Currently includes the following helper functions:

#### createHeader(data, content_type = "application/json")
Creates a request header for use with fetch. The method is always POST!

#### resetStatus(time = 2000)
Resets the command status panel after the given time...

#### beginExecution(func)
Takes a function signature and tries to execute it 10 times with an timeout of 1 second in-between.
Used to load scripts dynamically.

#### formatDate(date = date.now())
Formats a given date to the following format:
YYYY.MM.DD hh:mm

#### createChart(canvasId, type, labels, colors, myOptions, infotext="")
Creates a new chart and inserts it into a canvas via `canvasId`.
Uses different configurations depending on the chart `type`.
Also sets `labels`, `colors`, additional Options (`myOptions`) and an optional `infotext`.

## sha
External library whcih includes all sha3 algorythms
