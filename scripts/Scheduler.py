#!/usr/bin/env

from time import sleep
from importlib import import_module

from config import LOOPTIME, SCHEDULEPROCS, SCHEDULEROOT


modules = []
for proc in SCHEDULEPROCS:
    modules.append(import_module("{}.{}".format(SCHEDULEROOT, proc)))

while True:
    for module in modules:
        module.run()

    sleep(LOOPTIME)

