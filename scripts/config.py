#!/usr/bin/env python3

import os

#Current directory
ROOTDIR = os.path.dirname(os.path.abspath(__file__))

# DB Setup scripts
DBSCRIPTS = [
    "raspi_notes_setup.sql",
    "raspi_monitoring_setup.sql"
]
DBSCRIPTS = list(map(lambda file: ROOTDIR + "/DatabaseSetup/" + file, DBSCRIPTS))

# DB File Path
DBFILE = ROOTDIR + "/../data/sqdb.db"

# In seconds
LOOPTIME = 3

# Scheduler Process Files
# (Must implement a run method)
SCHEDULEROOT = "NeoLogic"
SCHEDULEPROCS = ["RaspiReadout"]

