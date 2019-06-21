#!/usr/bin/env python3

import sqlite3

print("Setup started...")
connection = sqlite3.connect("../data/sqdb.db")
db = connection.cursor()

file = open("./setup.sql", "r")
script = file.read()
file.close()

db.executescript(script)

db.close()
connection.close()
print("Setup completed!")
