#!/usr/bin/env python3

import psutil
import sqlite3
from time import time

from config import DBFILE


def __insert(data:dict):
    keys = ["timestamp", "temp", "cpu_usage", "storage_usage", "ram_usage"]

    conn = sqlite3.connect(DBFILE)
    db = conn.cursor()
    db.execute("INSERT INTO raspi_monitoring VALUES(?, ?, ?, ?, ?)",
               list(map(lambda key: data[key], keys)))
    conn.commit()

    db.close()
    conn.close()


def __getTemp():
    try:
        with open("/sys/class/thermal/thermal_zone0/temp") as file:
            temp = int(file.read())/1000
    except FileNotFoundError:
        print("Tmp File not found! Set to 0!")
        temp = 0

    return temp


def run():
    data = {}
    data["timestamp"] = int(time())
    data["temp"] = __getTemp()
    data["cpu_usage"] = psutil.cpu_percent()/100
    data["storage_usage"] = psutil.disk_usage("/").percent/100
    data["ram_usage"] = psutil.virtual_memory().percent/100
    __insert(data)

