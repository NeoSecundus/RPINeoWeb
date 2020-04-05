# Libraries Documentation
## Table of Content
1. [User Manager](#user-manager)
2. [DataGrabber](#datagrabber)
	1. [Monitoring](#monitoring)
## User Manager
Manages the user-database and everything user-related.

## DataGrabber 
### Monitoring
Collects the data from the monitoring table and pre-filters it for use in the Monitoring page.

Known filters are: 
now -> Gets current data
hour -> Gets averaged data-set of last hour (30 values)
day -> Gets averaged data-set of last day. Average per hour.
month -> Gets averaged data-set of last month. Average per day.

## NoteManager
Manages the note and notegroup tables of the database. This includes INSERT, UPDATE, DELETE and SELECT on both tables.
Select always collects all entries in a group.
