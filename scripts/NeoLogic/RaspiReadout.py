#!/usr/bin/env python3

import psutil
import sqlite3
import Adafruit_DHT
from time import time

from config import DBFILE, DHTPIN


def _insert(data:dict):
    keys = ["timestamp", "cpu_temp", "cpu_usage", "storage_usage", "ram_usage", "room_temp", "room_hum"]

    conn = sqlite3.connect(DBFILE)
    db = conn.cursor()
    db.execute("INSERT INTO raspi_monitoring VALUES(?, ?, ?, ?, ?, ?, ?)",
               list(map(lambda key: data[key], keys)))
    conn.commit()

    db.close()
    conn.close()


def _getTemp():
    try:
        with open("/sys/class/thermal/thermal_zone0/temp") as file:
            temp = int(file.read())/1000
    except Error:
        print("Tmp File not found! Set to 0!")
        temp = 0

    return temp


def _collect_dht_data(data: dict) -> None:
    sensor = Adafruit_DHT.DHT22

    hum, temp = Adafruit_DHT.read_retry(sensor, DHTPIN)
    if hum is not None and temp is not None:
        data["room_hum"] = hum
        data["room_temp"] = temp
    else:
        print("Could not read from DHT Sensor! Set to 0!")
        data["room_hum"] = 0
        data["room_temp"] = 0


def run():
    data = {}
    data["timestamp"] = int(time())
    data["temp"] = _getTemp()
    data["cpu_usage"] = psutil.cpu_percent()/100
    data["storage_usage"] = psutil.disk_usage("/").percent/100
    data["ram_usage"] = psutil.virtual_memory().percent/100
    _collect_dht_data(data)
    _insert(data)

