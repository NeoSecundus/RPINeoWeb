# Interface-Definition
## Table of Content
1. [GET Interfaces](#get-interfaces)
 1.1. [Get Resources](#get-resources)
 1.2. [Get Users](#get-users)
2. [POST Interfaces](#post-interfaces-json-)
 2.1. [User Section](#user-section)
  1. [Login](#login)
  2. [Register](#register)
  3. [Add User](#add-user)
  4. [Remove User](#remove-user)
  5. [Reset User Password](#reset-user-password)
  6. [Change User Rights](#change-user-rights)

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

## POST Interfaces (JSON)
---
## User Section
### Login
URL: /trylogin
Send:
```json
{"user":"string", "password":"string"}
```
Receive:
```json
{"status":"boolean", "msg":"string"}
```
Status:
- true = ok
- false = failed

---
### Register
URL: /tryregister
Send:
```json
{"user":"string", "password":"string"}
```
Receive:
```json
{"status":"boolean", "msg":"string"}
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
{"user":"string", "privileges":"string"}
```
Receive:
```json
{"status":"boolean", "msg":"string"}
```
Privileges:
- *Admin*
- *Member*
- *Guest*

Statuscodes:
- true = ok
- false = failed

---
### Remove User
**Needs admin rights!**
URL: /removeuser
Send:
```json
{"user":"string"}
```
Receive:
```json
{"status":"boolean", "msg":"string"}
```
Statuscodes:
- true = ok
- false = failed

---
### Reset User Password
**Needs admin rights!**
URL: /resetpassword
Send:
```json
{"user":"string"}
```

Receive:
```json
{"status":"boolean", "msg":"string"}
```

Statuscodes:
- true = ok
- false = failed

---
### Change User Rights
**Needs admin rights!**
URL: /changeprivileges
Send:
```json
{"user":"string", "privileges":"string"}
```

Receive:
```json
{"status":"boolean", "msg":"string"}
```

Privileges:
- Admin
- Member
- Guest

Statuscodes:
- true = ok
- false = failed


