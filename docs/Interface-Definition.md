# Interface-Definition
### Table of Content
1. [GET Interfaces](#get-interfaces)
 1.1. [Get Resources](#get-resources)
2. [POST Interfaces](#post-interfaces-json-)
 2.1. [Login](#login)
 2.2. [Register](#register)
 2.3. [AddUser](#add-user)
 2.4. [RemoveUser](#remove-user)
 2.5. [Get Users](#get-users)

## GET Interfaces
---
### Get Resources
URL: /resources/*
Will get the requested resources from the Server.

Resources include:
- Images _(/resources/images/*)_
- Stylesheets _(/resources/css/*)_
- JavaScript _(/resources/js/*)_

Receive:
```
Content-Data (Text/Binary)
```

## POST Interfaces (JSON)
---
### Login
URL: /trylogin
Send:
```json
{"user":"username", "pass":"password"}
```
Receive:
```json
{"status":"true/false", "msg":"Status Message"}
```
Status:
- true = ok
- false = failed

---
### Register
URL: /tryregister
Send:
```json
{"user":"username", "pass":"password"}
```
Receive:
```json
{"status":"true/false", "msg":"Status Message"}
```
Statuscodes:
- true = ok
- false = failed

---
### Add User
**Needs admin rights!**
URL: /adduser
Send:
```json
{"user":"username"}
```
Receive:
```json
{"status":"true/false", "msg":"Status Message"}
```
Statuscodes:
- true = ok
- false = failed

---
### Remove User
**Needs admin rights!**
URL: /removeuser
Send:
```json
{"user":"username"}
```
Receive:
```json
{"status":"true/false", "msg":"Status Message"}
```
Statuscodes:
- true = ok
- false = failed

---
### Get Users
**Needs admin rights!**
URL: /getusers
Will request a list of users from the Server.
**Does not need data to be sent!**

Receive:
```json
{"user1":"pass1", "user2":"pass2", ...}
```