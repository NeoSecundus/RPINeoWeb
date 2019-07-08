#!/usr/bin/env python3

import os

#Current directory
ROOTDIR = os.path.dirname(os.path.abspath(__file__))

# DB Setup scripts
DBSCRIPTS = list(map(lambda file: ROOTDIR + "/DatabaseSetup/" + file, os.listdir(ROOTDIR + "/DatabaseSetup")))

# DB File Path
DBFILE = ROOTDIR + "/../data/sqdb.db"

# In seconds
LOOPTIME = 3

# Scheduler Process Files
# (Must implement a run method)
SCHEDULEROOT = ROOTDIR + "/NeoLogic"
SCHEDULEPROCS = ["RaspiReadout"]

