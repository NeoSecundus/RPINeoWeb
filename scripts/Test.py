#!/usr/bin/env python3

from NeoLogic import NeoCrypt

encoded = NeoCrypt.encode("Hello Darling!", "Sweet")
print(encoded)
print(NeoCrypt.decode(encoded, "Sweet"))