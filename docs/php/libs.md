# Libraries Documentation
## Table of Content
1. [Post Resolver](#postresolver)
2. [Logger](#Logger)

## PostResolver
Reolves post data and returns whatever data was sent in a parsed format.

Formats known by resolver:
- JSON (application/json)

## Logger
Used to write logs to the logfile. 

Warning levels and functions:
- Level 0 (Error) -> `static error($msg)` 
- Level 1 (Warn) -> `static warn($msg)` 
- Level 2 (Info) -> `static info($msg)` 
- Level 3 (Fine) -> `static fine($msg)` 
