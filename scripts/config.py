#!/usr/bin/env python3

import os
import logging

#Current directory
ROOTDIR = os.path.dirname(os.path.abspath(__file__))

# DB Setup scripts
_DBDIR = ROOTDIR + "/DatabaseSetup/"
DBSCRIPTS = list(map(lambda file: _DBDIR + file, os.listdir(_DBDIR)))

# DB File Path
DBFILE = ROOTDIR + "/../data/sqdb.db"

# Pin for temperature and humidity readout (Sensor data pin)
BME_ADDRESS = 0x76

# In seconds
LOOPTIME = 3

# Scheduler Process Files
# (Must implement a run method)
SCHEDULEROOT = "NeoLogic"
SCHEDULEPROCS = ["RaspiReadout", "WSDataCollector"]

# Global logger
def _get_logger() -> logging.Logger:
    formatter = logging.Formatter("%(asctime)s %(levelname)s: -- %(message)s")
    handler = logging.FileHandler(ROOTDIR + "/../log/service.log")
    handler.setFormatter(formatter)

    logger = logging.getLogger("NWEB_SERVICE")
    logger.addHandler(handler)
    return logger

GLOGGER = _get_logger()
GLOGGER.setLevel(logging.WARN)
