#!/usr/bin/env python3

import sqlite3
from time import sleep

from config import DBFILE
from NeoLogic.RaspiNoteManager import run as runNoteManager

conn = sqlite3.connect(DBFILE)
curse = conn.cursor()


# setup database
import DatabaseSetup


# Insert Data
curse.execute(f"INSERT INTO raspi_notes VALUES('TEST', "
              f"NULL, "
              f"'This is a test!', "
              f"strftime('%s', 'now'), "
              f"strftime('%s', 'now')+20);")

curse.execute(f"INSERT INTO raspi_notes VALUES('TEST2', "
              f"NULL, "
              f"'This is a test! Delete me...', "
              f"strftime('%s', 'now'), "
              f"strftime('%s', 'now')+5);")

res = curse.execute("SELECT * FROM raspi_notes")
for fetched in res.fetchall():
    print(fetched)

print("sleeping...")
sleep(10)

curse.close()
conn.commit()
conn.close()
runNoteManager()

conn = sqlite3.connect(DBFILE)
curse = conn.cursor()
res = curse.execute("SELECT * FROM raspi_notes")
data = res.fetchall()
for fetched in data:
    print(fetched)
print(len(data))

curse.close()
conn.close()