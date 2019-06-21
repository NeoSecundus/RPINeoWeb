#!/usr/bin/env python3

import sqlite3
import time

conn = sqlite3.connect("../data/sqdb.db")
curse = conn.cursor()

data = [time.time(), 50.241, 0.2, 1800, 0.1, 29000]
curse.execute("INSERT INTO raspi_monitoring VALUES (?, ?, ?, ?, ?, ?)", data)

curse.close()
conn.close()