#!/usr/bin/env python3

from NeoDB.NeoCrypt import *

crypt = encode("Hello! Fancy Müting yö#_. How is it going?!? ;-)")
print(crypt)

print("Decrypted:")
print(decode(crypt))
