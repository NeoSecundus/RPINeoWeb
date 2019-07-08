#!/usr/bin/env python3

import os

# DB Setup scripts
DBSCRIPTS = os.listdir("./DatabaseSetup")

# DB File Path
DBFILE = "../data/sqdb.db"

# In seconds
LOOPTIME = 3

# Scheduler Process Files
# (Must implement a run method)
SCHEDULEROOT = "NeoLogic"
SCHEDULEPROCS = ["RaspiReadout"]
