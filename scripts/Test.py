#!/usr/bin/env python3

import sqlite3
import time
from random import randint
from time import sleep

from config import LOOPTIME, DBFILE

conn = sqlite3.connect(DBFILE)
curse = conn.cursor()


# setup database
with open("./DatabaseSetup/raspi_monitoring_setup.sql") as sqlFile:
    curse.executescript(sqlFile.read())


# Insert Data
for i in range(0, 200):
    data = [int(time.time()), randint(40, 80), randint(20, 90)/100, randint(20, 90)/100, randint(20, 90)/100]
    curse.execute("INSERT INTO raspi_monitoring VALUES (?, ?, ?, ?, ?)", data)
    conn.commit()
    print(f"\rStatus: {i}", end="")
    sleep(LOOPTIME)


# Print result
res = curse.execute("SELECT * FROM raspi_monitoring")
for fetched in res.fetchall():
    print(fetched)

curse.close()
conn.close()