#!/usr/bin/env python3

import sqlite3
from random import randint, random
from time import sleep, time

from config import DBFILE

conn = sqlite3.connect(DBFILE)
curse = conn.cursor()
curse.execute("PRAGMA foreign_keys = ON;")

# setup database
#import DatabaseSetup


# Insert Data to Notes
#groups = ["Job", "Hobby", "Company", "Fun", "Clear", "root"]
#users = ["teuschl", "remitz", "hipfl"]

#for i in range(0, len(groups)):
#    curse.execute(f"INSERT INTO raspi_note_groups VALUES('{groups[i]}', '{users[i%3]}', '#{(i+1)*111111}');")

#conn.commit()

#for i in range(30):
#    curse.execute(f"INSERT INTO raspi_notes VALUES('TEST{i}', "
#                  f"'{users[i%3]}',"
#                  f"'{groups[i % 6]}', "
#                  f"'This is a test!', "
#                  f"strftime('%s', 'now')*1000)")
#conn.commit()

# Insert Data to RPIData
print("Inserting raspi_values...")

loops = 1000
for i in range(loops):
    print(f"{(i+1)*100/loops}%\r", end="")
    sleep(3)
    curse.execute(f"INSERT INTO raspi_monitoring VALUES("
    f"{int(time())},"
    f"{randint(50, 80)},"
    f"{random()},"
    f"{random()},"
    f"{random()},"
    f"{random() * 10 + 20:.3f},"
    f"{randint(10, 90)})")
    conn.commit()

curse.close()
conn.close()
print("Done!")