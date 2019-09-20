#!/usr/bin/env python3

import sqlite3

from config import DBFILE

conn = sqlite3.connect(DBFILE)
curse = conn.cursor()

# setup database
import DatabaseSetup


# Insert Data
groups = ["Job", "Hobby", "Company", "Fun", "Clear", None]
for i in range(0, 100):
    curse.execute(f"INSERT INTO raspi_notes VALUES('TEST{i}', "
                  f"'teuschl',"
                  f"'{groups[i % 6]}', "
                  f"'This is a test!', "
                  f"strftime('%s', 'now'), "
                  f"strftime('%s', 'now')+10000);")

curse.close()
conn.commit()
conn.close()
print("Done!")