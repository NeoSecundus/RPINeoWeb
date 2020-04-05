# Notes
## Table of Contents

1. [Reference](#reference)
2. [Emojis](#emojis)

## Reference
Has the same functions and data as in the [Interface Definition](../Interface-Definition.md)

## Emojis
Contains a table of most unicode Emojis.  
Checks for inputs and textareas with the "emoji-support" class.  
Adds eventlisteners to those inputs/textareas to check keypresses.  

On ":" the following chars will be recorded and on "Enter" the emojitable is searched for a matching emoji descriptor. This emoji is then added. If no emoji is found a "?" will be added instead.

