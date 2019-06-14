# Controller Documentation
## Table of Contents
1. [RESTGateway](#restgateway)

## RESTGateway
Manages all incoming requests
Also checks for user rights and if the user is logged in or wants to log-in

Differentiates between three types of requests:
- Resource requests
- Command requests
- Page requests

**Resource requests:**
Return the wanted resources with the right content-types

**Command requests:**
Executes a command on the server and return different values depending on the method

**Page requests:**
Returns a new page to be loaded
