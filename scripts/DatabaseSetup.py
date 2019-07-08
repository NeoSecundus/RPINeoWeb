#!/usr/bin/env python3

import sqlite3

from config import DBSCRIPTS, DBFILE

print("Setup started...")
connection = sqlite3.connect(DBFILE)
db = connection.cursor()

for scriptFile in DBSCRIPTS:
    with open(scriptFile, "r") as file:
        script = file.read()

    db.executescript(script)

db.close()
connection.close()
print("Setup completed!")
