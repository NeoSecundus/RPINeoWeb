#!/bin/bash

if [[ $UID -ne "0" ]]; then
    echo "Please run script with root permissions!"
    exit 2
fi

cutFromFile() {
    # arg1 = file to remove from
    # arg2 = text to remove
    if [[ $# -ne "2" ]]; then
        echo "Wrong number of arguments!"
        return -1
    fi

    TTEMP=$(cat $1)
    echo -e "${TTEMP/$2/}" > $1
}

# Remove Services
echo "Stopping Services..."
systemctl stop nweb_scheduler
systemctl stop ttyd

echo "Removing Services..."
systemctl disable nweb_scheduler
systemctl disable ttyd
rm -f /lib/systemd/system/nweb_scheduler.service
rm -f /lib/systemd/system/ttyd.service
systemctl daemon-reload

# Remove Apache Configs
echo "Removing apache configurations..."
cutFromFile "/etc/apache2/apache2.conf" "$(cat ./apache2_apache2.conf)" 
cutFromFile "/etc/apache2/ports.conf" "$(cat apache2_port.conf)"
a2dissite NeoWeb 1>> setup.log 2>> error.log
rm -f /etc/apache2/sites-available/NeoWeb.conf
rm -rf /etc/apache2/ssl
systemctl restart apache2

# Removing ttyd
echo "Removing ttyd..."
rm -f /usr/local/bin/ttyd
rm -f /usr/local/share/man/man1/ttyd.1

# Removing /var/nweb
echo "Removing /var/nweb"
rm -rf /var/nweb
