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
AGGREGATOR_DIR=""
AGGREGATOR_ENV=""

for i in "$@"
do
case $i in
    -v=*|--version=*)
    JENKINS_VERSION="${i#*=}"
    ;;
    -s|--snaps|--snapshots)
    LOCAL_SNAPSHOTS=true
    ;;
    -a=*|--aggregator=*)
    AGGREGATOR_DIR="${i#*=}"
    ;;
    --default)
    ;;
    *)
    PLUGINS="${PLUGINS} $i" && LOCAL_SNAPSHOTS=true
    ;;
esac
done

# For now, the location of the aggregator plugin must be defined until we have
# blueocean plugins in the Update Center.
if [ "${AGGREGATOR_DIR}" == "" ]; then
    echo ""
    echo " *********************************************************************"
    echo "    You must specify the location of the Blue Ocean"
    echo "    aggregator plugin e.g."
    echo "    ./run.sh -a=/Users/tfennelly/projects/blueocean/blueocean-plugin"
    echo " *********************************************************************"
    echo ""
    exit 1
fi
if [ ! -d "${AGGREGATOR_DIR}" ]; then
    echo ""
    echo " *********************************************************************"
    echo "    The Blue Ocean aggregator plugin location is not a"
    echo "    valid directory."
    echo " *********************************************************************"
    echo ""
    exit 1
fi

echo "------------------------------------------------"
echo "Running with switches:"
echo "    --version=${JENKINS_VERSION}"
echo "    --snapshots=${LOCAL_SNAPSHOTS}"
echo "    --aggregator=${AGGREGATOR_DIR}"

if [ "${PLUGINS}" == "" ]; then
    echo ""
    echo "    No local plugins specified. E.g.:"
    echo "    ./run.sh blueocean-plugin.jpi=../blueocean/blueocean-plugin/target/blueocean-plugin.hpi"
    echo ""
fi

if [ "${AGGREGATOR_DIR}" != "" ]; then
    echo ""
    echo "Assembling aggregator plugin dependencies..."
    echo ""
    pushd "${AGGREGATOR_DIR}"
    mvn hpi:assemble-dependencies
    popd
    # Need to manually copy the admin plugin because it's only a test
    # dependency in the aggregator plugin.
    # See https://github.com/cloudbees/blueocean/pull/187
    cp "${AGGREGATOR_DIR}/../blueocean-admin/target/blueocean-admin.hpi" "${AGGREGATOR_DIR}/target/plugins"
    AGGREGATOR_ENV="PLUGINS_DIR=${AGGREGATOR_DIR}/target/plugins"
fi

EXECUTION="env LOCAL_SNAPSHOTS=${LOCAL_SNAPSHOTS} ${PLUGINS} ${AGGREGATOR_ENV} JENKINS_WAR=./wars/jenkins-${JENKINS_VERSION}.war mvn test"

echo ""
echo "> ${EXECUTION}"
echo ""

echo "------------------------------------------------"

# Download the jenkins war
source download_war.sh "${JENKINS_VERSION}"

# Run the tests
eval "${EXECUTION}"


