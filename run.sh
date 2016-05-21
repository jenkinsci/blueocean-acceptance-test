#!/bin/bash

# ---------------------------------------------------------
# Takes the Jenkins version against which the tests are
# to be run as a single arg. Will download if needed.
# 
# e.g. to run against version 2.5
# 
# ./run.sh 2.5
# 
# ---------------------------------------------------------

JENKINS_VERSION=$1

if [ "${JENKINS_VERSION}" == "" ]; then
    # default if not supplied ...
    JENKINS_VERSION=2.5
fi

# Download the jenkins war
source download_war.sh "${JENKINS_VERSION}"

# Run the tests
eval "JENKINS_WAR=./wars/jenkins-${JENKINS_VERSION}.war mvn test"


