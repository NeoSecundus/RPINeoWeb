#!/usr/bin/env python3

from NeoDB.NeoDBConfig import *

from time import time
from functools import reduce

__millis = int((time() - int(time())) * 1000)
if __millis < 100:
    __millis += 100

__keyBits = reduce(lambda x, y: x + y, list(map(lambda x: bin(ord(x))[2:], encryptionKey)))


def __incrementChar(curChar, millis):
    charNum = ord(curChar) + (millis ^ 2)
    while charNum >= 1114112:
        charNum -= 1114092

    return chr(charNum)


def __decrementChar(curChar, millis):
    charNum = ord(curChar) - (millis ^ 2)
    while charNum <= 20:
        charNum += 1114092

    return chr(charNum)


def encode(toEncode):
    encodedString = ""

    for i in range(0, (len(toEncode))):
        curBit = __keyBits[i % len(__keyBits)]

        if curBit == "0":
            newChar = __decrementChar(toEncode[i], __millis)
        else:
            if curBit == "1":
                newChar = __incrementChar(toEncode[i], __millis)
            else:
                print("Encoding error!")
                quit()

        encodedString = newChar + encodedString

    return encodedString + str(__millis)


def decode(toDecode):
    decodedString = ""

    milliKey = int(toDecode[-3:])

    for i in range(0, (len(toDecode)-3)):
        curBit = __keyBits[(len(toDecode) - i - 4) % len(__keyBits)]

        if curBit == "0":
            newChar = __incrementChar(toDecode[i], milliKey)
        else:
            if curBit == "1":
                newChar = __decrementChar(toDecode[i], milliKey)
            else:
                print("Decoding error!")
                quit()

        decodedString = newChar + decodedString

    return decodedString


