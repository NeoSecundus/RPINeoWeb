#!/usr/bin/env python3

# ----------------------------DATA---------------------------------
# Here you can set the standard data directory
# You can choose if you want to use multiple databases
# (Sub-folders) as well
#
# The maximum table-size (file-size) can also be specified (in MB)
# if you don't want this set it to 0
# for example 10.000 = 10GB || 0.01 = 10kB
dataDir = '/data'
multipleDataBases = False
maxTableSize = 0

# ------------------------ENCRYPTION-------------------------------
# Here you can set the database encryption to be active or not
# You also have to provide a key with which the data gets encrypted
encryption = False
encryptionKey = 'Key'

# -----------------------INDEXING----------------------------------
# Here you can set the type of indexing you want to use
# Available types are:
#   - serial (Numbering)
#   - time (Timestamp index)
#   - key (Keywords which must be set by user!)
indexType = 'serial'
