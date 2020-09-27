#!/bin/bash

#
# Setup Script for RPINeoWeb
#
ENDMSG=""

if [[ $UID -ne "0" ]]; then
    echo "Please run script with root permissions!"
    exit 2
fi

#
# Helper Functions
#

checkForPackage() {
    if [[ $# != "1" ]]; then
        return -1
    fi

    echo -n "Checking $1 installation..."

    dpkg -s $1 1>> setup.log 2>> error.log 2>&1

    if [[ $? -eq "1" ]]; then
        echo -e "\n$1 not installed! Installing now..."
        apt-get -y install $1 1>> setup.log 2>> error.log
    else
        echo " Found!"
    fi
} 

activateService() {
    if [[ $# != "1" ]]; then
        return -1
    fi

    echo -n "Installing $1 service..."

    systemctl daemon-reload
    systemctl enable $1
    systemctl restart $1
    
    if [[ $? -ne "0" ]]; then
        ENDMSG="${ENDMSG}Could not start $1 Service. Manual start necessary! Error Num: $?\n"
    fi

    echo " finished!"
}

#
# Resetting logs
#
echo "" > setup.log
echo "" > error.log

#
# Reset user-db and copy Root to /var/nweb
#
echo "Resetting users..."
cp ./users.ndb ../data/

echo "Creating folder..."
mkdir /var/nweb
cp -r .. /var/nweb

if [[ $? -ne "0" ]]; then
    echo "Could not create NeoWeb Folder! Exiting..."
    exit 1
fi

#
# Apache Dependencies
#
echo "Installing dependencies..."

# Check Php7.3 installation
checkForPackage "php7.3"
apt-get -y install php7.3-sqlite3

# Check Apache installation
checkForPackage "apache2"

# Check python3 and pip installation
checkForPackage "python3"
checkForPackage "python3-pip"

# Check sqlite3 installation
checkForPackage "sqlite3"

# Install Python requirements
pip3 install -r ../scripts/requirements.txt 1>> setup.log 2>> error.log

#
# Setup Python Scripts
#
python3 ../scripts/DatabaseSetup.py
cp ./nweb_scheduler.service /lib/systemd/system/
activateService "nweb_scheduler"

#
# Setup Apache2 configuration
#
echo "Configuring apache2 (Non-Destructive)..."

if [[ -z $(grep 'Directory /var/nweb' /etc/apache2/apache2.conf) ]]; then
    cat ./apache2_apache2.conf >> /etc/apache2/apache2.conf
fi

if [[ -z "$(grep 'Listen 3660' /etc/apache2/ports.conf)" ]]; then
    cat apache2_port.conf >> /etc/apache2/ports.conf 
fi

if [[ -e /etc/apache2/sites-available/NeoWeb.conf ]]; then
    echo "NeoWeb Config already exists! Reloading..."
    a2dissite NeoWeb 1>> setup.log 2>> error.log
fi

cp ./NeoWeb.conf /etc/apache2/sites-available/

PHP_TEMP=$(cat /etc/php/?.?/apache2/php.ini)
cp /etc/php/?.?/apache2/php.ini /etc/php/?.?/apache2/php_backup.ini
echo -e "${PHP_TEMP/;extension=sqlite3/extension=sqlite3}" > /etc/php/?.?/apache2/php.ini

# ssl
echo "Enabling ssl..."
cp -r ./ssl /etc/apache2/
a2enmod ssl 1>> setup.log 2>> error.log
a2enmod rewrite 1>> setup.log 2>> error.log
a2enmod actions 1>> setup.log 2>> error.log
a2ensite NeoWeb 1>> setup.log 2>> error.log

apache2ctl restart

if [[ $? -ne "0" ]]; then
    echo "Problem with Apache Configuration! Exiting..."
    exit 4
fi

#
# TTYD Terminal Setup
#
echo "Installing TTYD... "
apt-get -y install build-essential cmake git libjson-c-dev libwebsockets-dev 1>> setup.log 2>> error.log
git clone https://github.com/tsl0922/ttyd.git 1>> setup.log 2>> error.log

if [[ $? -eq "0" ]]; then
    cd ttyd && mkdir build && cd build
    cmake .. 1>> setup.log 2>> error.log
    make && make install 1>> setup.log 2>> error.log
    cd ../..
    rm -rf ./ttyd

    cp ./ttyd.service /lib/systemd/system/
    activateService "ttyd"
else 
    echo "TTYD Terminal installation failed! Git repo unreachable or broken!"
fi

#
# Setting Rights
#
echo "Setting user-rights for NeoWeb..."
chown -R www-data /var/nweb

if [[ $? -ne "0" ]]; then
    ENDMSG="${ENDMSG}Failed to set correct rights for /var/nweb folder! Rights must be set for Webpage to work!\n"
fi

#
# Downloading npm & sass
#
checkForPackage "npm"
npm install -g sass

#
# ENDMSG printout
#
echo -e "${ENDMSG}"

echo "Done!"