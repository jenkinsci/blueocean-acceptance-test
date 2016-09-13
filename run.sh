#!/bin/bash

# ------------------------------------------------------------------------------------------------------------------
# Run acceptance tests.
# 
# args:
# 
#   -a  Blue Ocean aggregator plugin path
#       e.g. ./run.sh -a=/Users/tfennelly/projects/blueocean/blueocean-plugin
#   -v  Jenkins version
#       e.g. ./run.sh -v=2.5 
#   -s  Install local SNAPSHOTS. See https://github.com/jenkinsci/acceptance-test-harness/blob/master/docs/SUT-VERSIONS.md#install-plugins-from-local-maven-repository  
#       e.g.  ./run.sh -s
#   -d  Run a clean dev instance of Jenkins (with blueocean plugins) and keep it running. Allows you to do fast dev of tests in your IDE without having to
#       constanly wait for Jenkins to startup etc. Need to ensure that your test does not use JenkinsAcceptanceTestRule while you are developing
#       (e.g. via AbstractJUnitTest), or you'll be wasting your time.
#       e.g.  ./run.sh -d
# 
#   All other args are assumed to be customs plugins ala https://github.com/jenkinsci/acceptance-test-harness/blob/master/docs/SUT-VERSIONS.md#use-custom-plugin-file
#   e.g. ./run.sh blueocean-plugin.jpi=/Users/tfennelly/projects/blueocean/blueocean-plugin/target/blueocean-plugin.hpi
# 
# ------------------------------------------------------------------------------------------------------------------

JENKINS_VERSION=2.7.3
SELENIUM_VERSION=2.53

LOCAL_SNAPSHOTS=false
PLUGINS=""
AGGREGATOR_DIR=""
AGGREGATOR_ENV=""
DEV_JENKINS=false
PROFILES="-P runTests"
JENKINS_JAVA_OPTS="-Djava.util.logging.config.file=./logging.properties"
TEST_TO_RUN="-Dtest=AllTest"

for i in "$@"
do
case $i in
    -a=*|--aggregator=*)
    AGGREGATOR_DIR="${i#*=}"
    ;;
    -v=*|--version=*)
    JENKINS_VERSION="${i#*=}"
    ;;
    -s|--snaps|--snapshots)
    LOCAL_SNAPSHOTS=true
    ;;
    -d|--dev)
    DEV_JENKINS=true    
    ;;
    --default)
    ;;
    *)
    PLUGINS="${PLUGINS} $i" && LOCAL_SNAPSHOTS=true
    ;;
esac
done

if [ "${DEV_JENKINS}" == "true" ]; then
    echo ""
    echo "*****"
    echo "***** Starting a test dev instance of Jenkins with the blueocean plugins."
    echo "***** Watch console output for the URL to use while developing your test."
    echo "*****"
    echo "***** Be sure your test doesn't use JenkinsAcceptanceTestRule in any way"
    echo "***** or you'll be defeating the purpose (e.g. via AbstractJUnitTest)."
    echo "*****"
    echo ""
    
    # Exclude the actual tests from this run and just run the skeleton test in
    # ExcludedRunnerTest. It will just run with the plugins and stay running
    # allowing you to iterate on your acceptance test dode without constantly
    # having to restart Jenkins.
    PROFILES="-P runDevRunner"
    TEST_TO_RUN=""
fi

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
pushd "${AGGREGATOR_DIR}"
AGGREGATOR_GROUP_ID=`echo -e 'setns x=http://maven.apache.org/POM/4.0.0\ncat /x:project/x:parent/x:groupId/text()' | xmllint --shell pom.xml | grep -v /`
AGGREGATOR_ARTIFACT_ID=`echo -e 'setns x=http://maven.apache.org/POM/4.0.0\ncat /x:project/x:artifactId/text()' | xmllint --shell pom.xml | grep -v /`
popd
if [ "${AGGREGATOR_GROUP_ID}" != "io.jenkins.blueocean" ] || [ "${AGGREGATOR_ARTIFACT_ID}" != "blueocean" ]; then
    echo ""
    echo " *********************************************************************"
    echo "    The location specified for the aggregator plugin does not appear"
    echo "    to be correct. Check the supplied parameter and make sure it"
    echo "    points to the aggregator plugin."
    echo "    > groupId:    ${AGGREGATOR_GROUP_ID}"
    echo "    > artifactId: ${AGGREGATOR_ARTIFACT_ID}"
    echo " *********************************************************************"
    echo ""
    exit 1
fi

echo "------------------------------------------------"
echo "Running with switches:"
echo "    --version=${JENKINS_VERSION}"
echo "    --snapshots=${LOCAL_SNAPSHOTS}"
echo "    --aggregator=${AGGREGATOR_DIR}"
echo "    --dev=${DEV_JENKINS}"

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
    if [ $? != 0 ];then
        echo "*****"
        echo "***** Error assembling dependencies from aggregator plugin. Maybe you need to rebuild everything."
        echo "*****"
        exit 1
    fi
    popd

    AGGREGATOR_ENV="PLUGINS_DIR=${AGGREGATOR_DIR}/target/plugins"
fi

EXECUTION="env JENKINS_JAVA_OPTS=${JENKINS_JAVA_OPTS} BROWSER=phantomjs LOCAL_SNAPSHOTS=${LOCAL_SNAPSHOTS} ${PLUGINS} ${AGGREGATOR_ENV} PATH=./node:./node/npm/bin:./node_modules/.bin:${PATH} JENKINS_WAR=./bin/jenkins-${JENKINS_VERSION}.war mvn test ${PROFILES} ${TEST_TO_RUN}"

echo ""
echo "> ${EXECUTION}"
echo ""

echo "------------------------------------------------"

# Download the jenkins war
source download.sh "http://mirrors.jenkins-ci.org/war-stable/${JENKINS_VERSION}/jenkins.war" "bin/jenkins-${JENKINS_VERSION}.war"
# Download Selenium standalone
source download.sh "http://selenium-release.storage.googleapis.com/${SELENIUM_VERSION}/selenium-server-standalone-${SELENIUM_VERSION}.0.jar" "bin/selenium-server-standalone-${SELENIUM_VERSION}.1.jar"

# Run the tests
eval "${EXECUTION}"


