#!/bin/bash

echo ""
echo " Zapping old container, if any. This may take a few seconds..."
echo ""
docker stop blueo-selenium && docker rm blueo-selenium
