#!/usr/bin/env python3

import sqlite3
import time

conn = sqlite3.connect("../data/sqdb.db")
curse = conn.cursor()

data = [int(time.time()), 50.241, 0.2, 0.6, 0.85]
curse.execute("INSERT INTO raspi_monitoring VALUES (?, ?, ?, ?, ?)", data)
conn.commit()
# res = curse.execute("SELECT * FROM raspi_monitoring WHERE id == (SELECT max(id) FROM raspi_monitoring)")
# print(res.fetchall())

curse.close()
conn.close()