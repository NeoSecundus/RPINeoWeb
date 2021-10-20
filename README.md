# RPINeoWeb

A personal Project that I decided to share with anyone who's interested. At it's base this Project is a Modular Website/Server that can be expanded however one wants to expand it.

## Basic Idea

It is made solely for my personal needs and for experimentation. It is built without Framework or libraries. Everything is in plain (JavaScript/PHP/Python/etc.). There are only 3 libraries currently in use, which are all located in "./resources/js/external". Styles and Pages were written without a template as well so sorry if they are a little ugly. I am *not* a designer and you are more then welcome to update their style. :sweat_smile:

The used languages (as indicated) are PHP for Backend, JavaScript, SCSS and Python for scheduling, data gathering and database management. The database is a simple SQLite3 database.

## Setup

There is a install shell script included in the repo which is in the setup folder. If it works correctly this script will do most of the hard lifting for you. It will; 
- check if all necessary packages are installed
- install the database and prepare it for operation
- install a service that starts the scheduler on system start
- configure apache2 + ssl
- set up ttyd and install the service (Web Terminal Client)
- set correct rights for neo-web
- install SASS compiler (CSS compiler)

If the Script doesn't work you'll have to install and set up things manually. Look at [Extended Setup](./setup/ExtendedSetup.md) for a more detailed explanation.

### Extended Setup

For the extended Setup notes look in [ExtendedSetup.md](./setup/ExtendedSetup.md). It will be tedious if you're setting this up for the first time...

## Configuration 

There are multiple places where Configurations can be made. All of them are explained in more detail in the following sub-chapters.

### PHP

For PHP there's a `config.php` in `./src`. In this config you can set the allowed resource types, available themes and what kinds of users are allowed to access which modules. 

The standard user types from lowest to highest privileges are 'Guest', 'Member' and 'Admin'. If you set a module's or page's privilege to  'Guest' all Users are allowed to access this module. Set it to 'Member' and only 'Members' and 'Admins' can access it. 
> If you add a new module/page you must add it to this privilege list!

### Modules

Which modules are active can be edited in the [header file](./src/includes/html/header.phtml) in `./src/includes/html/header.phtml`. In that file you'll see button tags which look somewhat like this:

```html
<button onclick="
    requestPage('/habits.html');
    requestScript('/resources/js/habits.js');
    beginExecution('getHabits');
">
    <img src="/resources/images/icons/habits.png" alt="Habits" />
    Habits <span></span>
</button>
```

The requestPage method gets the Page dynamically and loads it into the main section.  
The requestScript method does the same for js scripts.  
Lastly the beginExecution Method tries to start the function of the script that was just loaded.  
The `<img>` tag represents the button/module logo and then comes the description and a mandatory `<span>` tag. If you remove this tag the button animation will no longer work.  

#### ADD Module  
If you want to add a module you have to create a new section like this with your page and optional script(s).

#### REMOVE Module 
If you want to remove a module you can either delete a section or just add `style="display:none;"`. The second option is recommended because you may forget to add beginExecution methods or likewise when re-installing the module.  

### Python Scheduler

The Python Scheduler can be configured with [config.py](./scripts/config.py) In this file you can set everything necessary for the Scheduler to run without problems. You may set the data collector modules you want to run as well.  
Most configs are detailed in the config file itself.

If you want to add a new Scheduler Process just add a python Script to the NeoLogic folder and add a run method within the script. (Not in a class!) Then you can add the script to the list of processes in the config file (Script-Name without '.py'). The constant is named `SCHEDULEPROCS`.

### Database

If you want to modify the Database in any way just add a new migration file to the [DatabaseSetup](./scripts/DatabaseSetup) folder within the ./scripts folder. It has to be named `migration_x.sql`, with x being the number of the new migration. The number has to be the highest known migration number + 1.

Then you have to run the DatabaseSetup.py file. **DO NOT** run the script directly! The DatabaseSetup.py Script will then recognize the new migration file and use it to modify the database and increase the Database version.

Copyright (c) 2021 Nikolas Teuschl
