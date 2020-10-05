#!/bin/bash

if [[ $UID != 0 ]]; then
	echo "Script must be run with root rights! Try sudo ./compile.sh"
	exit -1
fi

rm -rf ./resources/css/*

sass --style=compressed --no-source-map resources/scss:resources/css
chown -R www-data .

