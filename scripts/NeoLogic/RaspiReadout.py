#!/usr/bin/env python3

import psutil
import sqlite3
import board
import busio
import adafruit_bme280
from time import time

from config import DBFILE, BME_ADDRESS


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
    except FileNotFoundError:
        print("Tmp File not found! Set to 0!")
        temp = 0

    return temp


def _collect_bme_data(data: dict) -> None:
    i2c = busio.I2C(board.SCL, board.SDA)
    bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c, BME_ADDRESS)

    temp = bme280.temperature
    hum = bme280.humidity
    if hum is not None and temp is not None:
        data["room_hum"] = hum
        data["room_temp"] = temp
    else:
        print("Could not read from BME280 Sensor! Vakues set to 0!")
        data["room_hum"] = 0
        data["room_temp"] = 0


def run():
    data = {}
    data["timestamp"] = int(time())
    data["temp"] = _getTemp()
    data["cpu_usage"] = psutil.cpu_percent()/100
    data["storage_usage"] = psutil.disk_usage("/").percent/100
    data["ram_usage"] = psutil.virtual_memory().percent/100
    _collect_bme_data(data)
    _insert(data)

