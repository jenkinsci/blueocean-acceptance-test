#!/bin/bash

if [ ! -d wars ]; then
    mkdir wars
fi

VERSION=$1

if [ "${VERSION}" == "" ]; then
    VERSION=2.5
fi

URL="http://mirrors.jenkins-ci.org/war/${VERSION}/jenkins.war"
DOWNTO="wars/jenkins-${VERSION}.war"

do_download() {
    if [ -f "$DOWNTO" ]; then
        echo "***********"
        echo "${DOWNTO} already downloaded. Skipping download."
        echo "***********"
        return
    fi    

    echo ""
    echo "Downloading jenkins.war version ${VERSION} to ${DOWNTO} ..."
    echo ""

    # Try for curl, then wget, or fail
    if hash curl 2>/dev/null;
    then
        curl -o $DOWNTO -L $URL
    elif hash wget 2>/dev/null;
    then
        wget -O $DOWNTO $URL
    else
        echo "curl or wget must be installed."
        exit 1
    fi
    
    if [ $? != 0 ]
      then
        echo " ************************************"
        echo " **** ${DOWNTO} download failed."
        echo " ************************************"
        exit 1
    fi    
}

do_download;


