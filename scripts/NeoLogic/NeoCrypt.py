#!/usr/bin/env python3

from time import time
from functools import reduce


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


def __getCurrentMillis(millis, curPos, encryptionKey):
    curMilli = millis + ord(encryptionKey[curPos % len(encryptionKey)])
    if curMilli >= 1000:
        curMilli = curMilli % 1000

    return curMilli


def __getKeyBits(key):
    return reduce(lambda x, y: x + y, list(map(lambda x: bin(ord(x))[2:], key)))


def encode(toEncode, encryptionKey):
    encodedString = ""

    keyBits = __getKeyBits(encryptionKey)

    millis = int((time() - int(time())) * 1000)
    if millis < 100:
        millis += 100
    milliKey = millis + int(reduce(lambda x, y: x + y, map(lambda x: ord(x), encryptionKey)))
    if milliKey < 100:
        milliKey += 100
    elif milliKey >= 1000:
        milliKey %= 1000

    for i in range(0, (len(toEncode))):
        curBit = keyBits[i % len(keyBits)]

        if curBit == "0":
            newChar = __decrementChar(toEncode[i], milliKey)
        else:
            if curBit == "1":
                newChar = __incrementChar(toEncode[i], milliKey)
            else:
                raise KeyError("Encoding Error!")

        encodedString = newChar + encodedString

    return encodedString + str(millis)


def decode(toDecode, encryptionKey):
    decodedString = ""

    keyBits = __getKeyBits(encryptionKey)
    milliKey = int(toDecode[-3:])
    milliKey += int(reduce(lambda x, y: x + y, map(lambda x: ord(x), encryptionKey)))
    if milliKey < 100:
        milliKey += 100
    elif milliKey >= 1000:
        milliKey %= 1000

    for i in range(0, (len(toDecode)-3)):
        curBit = keyBits[(len(toDecode) - i - 4) % len(keyBits)]

        if curBit == "0":
            newChar = __incrementChar(toDecode[i], milliKey)
        else:
            if curBit == "1":
                newChar = __decrementChar(toDecode[i], milliKey)
            else:
                raise KeyError("Encoding Error!")

        decodedString = newChar + decodedString

    return decodedString


