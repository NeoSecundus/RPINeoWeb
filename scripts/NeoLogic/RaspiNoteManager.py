#!/usr/bin/env python3

import sqlite3

from config import DBFILE


def run():
    conn = sqlite3.connect(DBFILE)
    db = conn.cursor()
    db.execute("DELETE FROM raspi_notes WHERE clear_date < strftime('%s', 'now');")
    db.close()
    conn.commit()
    conn.close()

