#!/bin/bash

./stop-selenium.sh

echo ""
echo " Starting Selenium Docker container..."
echo ""
docker run -d --name blueo-selenium -p 15900:5900 -p 4444:4444 -e no_proxy=localhost selenium/standalone-firefox-debug:2.53.0

# Output the containers bridge network IP to file
docker inspect -f '{{ .NetworkSettings.IPAddress }}' blueo-selenium > ./target/.selenium_ip

echo ""
echo "**************************************************************"
echo "**** Docker container with Selenium, Firefox and VNC running."
echo "****   To connect and view, run:"
echo "****   $ open vnc://:secret@localhost:15900"
echo "**************************************************************"
