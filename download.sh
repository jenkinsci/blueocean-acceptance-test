#!/bin/bash

if [ ! -d bin ]; then
    mkdir bin
fi

URL=$1
DOWNTO=$2

do_download() {
    if [ -f "$DOWNTO" ]; then
        echo ""
        echo "***** ${DOWNTO} already downloaded. Skipping download."
        echo ""
        return
    fi    

    echo ""
    echo "Downloading ${URL} to ${DOWNTO} ..."
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


