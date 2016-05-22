#!/bin/bash

# ---------------------------------------------------------
# Takes the Jenkins version against which the tests are
# to be run as a single arg. Will download if needed.
# 
# e.g. to run against version 2.5
# 
# ./run.sh --version=2.5
# 
# ---------------------------------------------------------

JENKINS_VERSION=2.5
LOCAL_SNAPSHOTS=false
PLUGINS=""

for i in "$@"
do
case $i in
    -v=*|--version=*)
    JENKINS_VERSION="${i#*=}"
    ;;
    -s|--snaps|--snapshots)
    LOCAL_SNAPSHOTS=true
    ;;
    --default)
    ;;
    *)
    PLUGINS="${PLUGINS} $i" && LOCAL_SNAPSHOTS=true
            # unknown option
    ;;
esac
done

echo "------------------------------------------------"
echo "Running with switches:"
echo "    --version=${JENKINS_VERSION}"
echo "    --snapshots=${LOCAL_SNAPSHOTS}"
if [ "${PLUGINS}" == "" ]; then
    echo ""
    echo "    No local plugins specified. E.g.:"
    echo "    ./run.sh blueocean-plugin.jpi=../blueocean/blueocean-plugin/target/blueocean-plugin.hpi"
    echo ""
fi

EXECUTION="env LOCAL_SNAPSHOTS=${LOCAL_SNAPSHOTS} ${PLUGINS} JENKINS_WAR=./wars/jenkins-${JENKINS_VERSION}.war mvn test"

echo ""
echo "> ${EXECUTION}"
echo ""

echo "------------------------------------------------"

# Download the jenkins war
source download_war.sh "${JENKINS_VERSION}"

# Run the tests
eval "${EXECUTION}"


