#!/usr/bin/env python3

import sqlite3

from config import DBSCRIPTS, DBFILE

print("Setup started...")
connection = sqlite3.connect(DBFILE)
db = connection.cursor()

# Get DB Version
try:
    version = db.execute("SELECT MAX(version) FROM NWEB_DB_VERSION").fetchone()[0]
except sqlite3.OperationalError:
    version = 0
print(f"DB Version: {version}")

# Execute Setup and/or Migrations
for scriptFile in DBSCRIPTS:
    fname = scriptFile.split("/")[-1]
    fnum = int("0" + "".join(char for char in fname if char.isdigit()))

    if (fnum > version):
        print(f"Updating version to: {fnum}")
    else:
        continue

    with open(scriptFile, "r") as file:
        script = file.read()

    db.executescript(script)
    db.execute("UPDATE NWEB_DB_VERSION SET version = ? WHERE 1=1", [fnum])
    connection.commit()

db.close()
connection.close()
print("Setup completed!")
