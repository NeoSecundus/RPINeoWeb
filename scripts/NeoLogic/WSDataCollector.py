from scripts.config import LOOPTIME
import sqlite3 as sql
from sqlite3 import Row
from typing import Any
import urllib3 as url3
from urllib3.response import HTTPResponse
import json
import time

from config import DBFILE, GLOGGER


_PUMP_JSON_KEYS = ["host", "highThresh", 
    "lowThresh", "tankFilled", "pumpStatus", 
    "wateringDelay", "wateringTime"]
_PUMP_TABLE_KEYS = ["host", "high_thresh",
    "low_thresh", "tank_filled", "pump_status", 
    "watering_delay", "watering_time"]


def _update_data(table_key: str, data: Any, pump_id: int):
    """Gets called by check_pump_data to update changed attributes
    """
    dbconn = sql.connect(DBFILE)
    curse = dbconn.cursor()
    curse.execute("UPDATE pump SET ? = ? WHERE id = ?", [table_key, data, pump_id])
    curse.close()
    dbconn.commit()
    dbconn.close()


def _check_pump_data(table_data, current_data):
    for i in range(len(_PUMP_TABLE_KEYS)):
        tkey = _PUMP_TABLE_KEYS[i]
        dkey = _PUMP_JSON_KEYS[i]
        if table_data[tkey] != current_data[dkey]:
            _update_data(tkey, current_data[dkey], table_data["id"])


def _collect_pump_data():
    """Retrieves data from the pumps and inserts it into the database.
    """
    dbconn = sql.connect(DBFILE)
    dbconn.row_factory = Row
    curse = dbconn.cursor()
    curse.execute("SELECT * FROM pump;")
    results = curse.fetchall()
    curse.close()
    dbconn.close()

    for pump in results:
        pm = url3.PoolManager()
        res: HTTPResponse = pm.request("GET", f"{pump['host']}:{pump['port']}/data")
        
        if res.status == 200:
            data = json.loads(res.data.decode("UTF-8"))
            dbconn = sql.connect(DBFILE)
            curse = dbconn.cursor()
            curse.execute("INSERT INTO wsData VALUES(?, ?, ?)", [
                int(time.time()),
                pump["id"],
                data["humidity"]
                ]
            )
            curse.close()
            dbconn.close()

            _check_pump_data(pump, data)
            _compact_pump_data(pump["id"])


def _compact_pump_data(pump_id: int):
    """Collects data from the wsData table and tries to compact the last hour
    """
    dbconn = sql.connect(DBFILE)
    dbconn.row_factory = Row
    curse = dbconn.cursor()
    time_border = int(time.time()) - 1800
    curse.execute("SELECT date, humidity FROM wsData WHERE pump_id = ? AND date > ?", [pump_id, time_border])
    results = curse.fetchall()

    if results[0]["date"] < time_border + LOOPTIME + 1:
        GLOGGER.info("Compacting pump data! Pump ID = %d", pump_id)
        avg_hum = 0.0
        for row in results:
            avg_hum += row["humidity"]
        avg_hum /= len(results)
        curse.execute("DELETE FROM wsData WHERE pump_id = ? AND date > ?", [pump_id, time_border])
        dbconn.commit()
        curse.execute("INSERT INTO wsDATA VALUES(?, ?, ?)", [time_border, pump_id, avg_hum])
        dbconn.commit()
    curse.close()
    dbconn.close()


def run():
    try:
        _collect_pump_data()
    except Exception as e:
        GLOGGER.error("Could not collect pump data! %s", type(e).__name__)
