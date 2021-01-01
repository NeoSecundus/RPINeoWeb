#!/usr/bin/env python3

import os

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
SCHEDULEPROCS = ["RaspiReadout"]

