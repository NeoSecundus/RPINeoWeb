# Root Documentation
## Table of Contents

1. [Login](#login)
2. [PageLoader](#pageloader)
3. [Register](#register)
4. [UserManagement](#usermanagement)

## Login
Has a method requestLogin() which does exactly what it says...

## PageLoader
Has two methods which can load pages or scripts
Also has a method to logout the user
#### requestPage()
Requests a page from the server and loads the page into the '#main' section
#### requestScript()
Requests a script from the server which will be loaded into the header
Checks if script already exists -> cancels if it does
#### logout()
Logs out the current user (deletes the login cookie)

## Register
Has a method requestRegister() which does exactly what it says...

## UserManagement
Includes the following functions for use with the userManagement page.
#### getUserList()
Requests users from the server and writes a list of all users and their privileges in the user-list.
#### changeUser(action, data)
Used to change users in any way. Communicates with the server per fetch. What exactly is done is specified in the following functions.
#### changePrivileges()
*Uses changeUser()*
Changes user privileges.
#### resetPassword()
*Uses changeUser()*
Resets the users password so he can re-regsiter to update his password.
#### removeUser()
*Uses changeUser()*
Removes a User.
#### addUser()
*Uses changeUser()*
Adds a new user with the specified privileges



