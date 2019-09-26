#!/usr/bin/env python3

import sqlite3

from config import DBFILE

conn = sqlite3.connect(DBFILE)
curse = conn.cursor()
curse.execute("PRAGMA foreign_keys = ON;")

# setup database
import DatabaseSetup


# Insert Data
groups = ["Job", "Hobby", "Company", "Fun", "Clear", "root"]
users = ["teuschl", "remitz", "hipfl"]

for i in range(0, len(groups)):
    curse.execute(f"INSERT INTO raspi_note_groups VALUES('{groups[i]}', '{users[i%3]}', '#{(i+1)*111111}');")

conn.commit()

for i in range(0, 30):
    curse.execute(f"INSERT INTO raspi_notes VALUES('TEST{i}', "
                  f"'{users[i%3]}',"
                  f"'{groups[i % 6]}', "
                  f"'This is a test!', "
                  f"strftime('%s', 'now'), "
                  f"strftime('%s', 'now')+10000);")

curse.close()
conn.commit()
conn.close()
print("Done!")