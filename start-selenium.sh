#!/bin/bash

./stop-selenium.sh

echo ""
echo " Starting container..."
echo ""
docker run -d --name blueo-selenium -p 15900:5900 -p 4444:4444 -e no_proxy=localhost selenium/standalone-firefox-debug:2.53.0

echo ""
echo "**************************************************************"
echo "**** Docker container with Selenium, Firefox and VNC running."
echo "****   To connect and view, run:"
echo "****   $ open vnc://:secret@localhost:15900"
echo "**************************************************************"
