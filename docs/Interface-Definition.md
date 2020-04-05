# Interface-Definition

## Table of Content
1. [GET Interfaces](#get-interfaces)  
   1. [Get Resources](#get-resources)  
   2. [Get Users](#get-users)  
2. [POST Interfaces](#post-interfaces-json-)  
   1. [User Section](#user-section)  
      1. [Login](#login)  
      2. [Register](#register)  
      3. [Add User](#add-user)  
      4. [Remove User](#remove-user)  
      5. [Reset User Password](#reset-user-password)  
      6. [Change User Rights](#change-user-rights)  
   2. [Get RPI Data](#get-rpi-data)  
   3. [Notes](#notes)
      1. [Get Notes](#get-notes)  
	  2. [Add Note](#add-note)  
	  3. [Delete Note](#delete-note)  
	  4. [Update Note](#update-note)  
   4. [NoteGroups](#notegroups)
	  1. [Get Groups](#get-groups)  
	  2. [Add Group](#add-group)
	  3. [Delete Group](#delete-group)
	  4. [Update Group](#update-group)  


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

Privileges:
- Admin
- Member
- Guest

Receive:
```json
{"status":"boolean", "msg":"string"}
``` 

Statuscodes:
- true = ok
- false = failed

---
## Get RPI Data
URL: /getrpidata
Send:
```json
{"view":"string"}
```

View:
"now" -> return current data,
"hour" -> return all data within the last hour,
"day" -> returns averaged values of every hour within the last day,
"month" -> returns averaged values of every day within the last month

Receive:
```json
[{"id": "int timestamp",
"cpu_usage": "float 0-1",
"storage_usage": "float 0-1",
"ram_usage": "float 0-1"}, ...]
```
Returns data in an array.

## Notes
### Get Notes
URL: /notes/getnotes

Send:
```json
{"group":"string"}
```

Receive:
```json
[{"title": "string",
"user": "string",
"group_title": "string",
"text": "string",
"create_date": "timestamp",
"clear_date": "timestamp"}, ...]
```
Return notes in an array.

---
### Add Note
URL: /notes/addnote

Send:
```json
{"title": "string",
"group": "string",
"text": "string",
"create_date":"timestamp"}
```
Adds a note to the database.

Receive:
```json
{"DBResponse": "???"}
```

---
### Delete Note
URL: /notes/deletenote

Send:
```json
{"title": "string",
"group": "string"}
```
Removes a note from the database.

Receive:
```json
{"DBResponse": "???"}
```

---
### Update Note
URL: /notes/updatenote

Send:
```json
{"title": "string",
"group": "string",
"new_title": "string", //optional
"new_text": "string"} //optional
```
Updates the text and title of a given note.

Receive:
```json
{"DBResponse": "???"}
```

## NoteGroups
### Get Groups
URL: /notes/getgroups

Send:
```json
{}
```

Receive:
```json
[{"title": "string",
"user": "string",
"color": "string (#ffffff)"}, ...]
```
Returns note-groups in an array. User gets checked automatically.

---
### Add Group
URL: /notes/addgroup

Send:
```json
{"title": "string",
"color": "string (#ffffff)"}
```
Adds new group to database. User gets checked automatically.

Receive:
```json
{"DBResponse": "???"}
```

---
### Delete Group
URL: /notes/deletegroup

Send:
```json
{"title": "string"}
```
Deletes group and all contained notes from database. User gets checked automatically.

Receive:
```json
{"DBResponse": "???"}
```

---
### Update Group
URL: /notes/updategroup

Send:
```json
{"title": "string",
"new_title": "string", //optional
"new_color": "string (#ffffff)"} //optional
```
Updates title and color of group if `new_*` parameters are set. User gets checked automatically.

Receive:
```json
{"DBResponse": "???"}
```
