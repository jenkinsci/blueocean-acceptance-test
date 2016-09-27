#!groovy

node ('docker') {

    def NOT_TRIGGERED = 'not-triggered'

    // Allow the pipeline to be built with parameters, defaulting the
    // Blue Ocean branch name to be that of the ATH branch name. If no such branch
    // of Blue Ocean exists, then the ATH will just run against the master branch of
    // Blue Ocean.
    properties([parameters([
            string(name: 'BLUEOCEAN_BRANCH_NAME', defaultValue: "${env.BRANCH_NAME}", description: 'Blue Ocean branch name against which the tests on this ATH branch will run.'),
            string(name: 'TRIGGERED_BY_BUILD_NUM', defaultValue: NOT_TRIGGERED, description: 'The Blue Ocean build number, if triggered by the building of a Blue Ocean branch. Used to get pre-assembled Jenkins plugins.')
    ]), pipelineTriggers([])])

    def branchName;
    def buildNumber;
    try {
        branchName = "${BLUEOCEAN_BRANCH_NAME}"
        buildNumber = "${TRIGGERED_BY_BUILD_NUM}"
    } catch (e) {
        echo "*************************************************************************************************************************"
        echo "Sorry, please run the build again if running manually. Parameters not yet initialized (or were modified) for this branch."
        echo "Otherwise, just wait for the next blue ocean build to trigger. This failed run will have initialized the Parameters."
        echo "*************************************************************************************************************************"
        currentBuild.result = "UNSTABLE"
        return
    }

    stage 'init'
    //deleteDir()
    checkout scm

    // Run selenium in a docker container of its own on the host.
    // It will output the selenium server address to ./target/.selenium_ip
    sh "./start-selenium.sh"
    def seleniumIP = readFile './target/.selenium_ip'

    try {
        // Build an image from the the local Dockerfile
        def athImg = docker.build('blueocean-ath-builder')

        // Expose the port on which the ATH Jenkins instance runs (12345), allowing the
        // Firefox browser (running in the selenium container) to make requests back
        // in etc.
        //
        // To bind in the local ~/.m2 when running in dev mode, simply add the following
        // volume binding to the "inside" container run settings (change username from "tfennelly"):
        //       -v /home/tfennelly/.m2:/home/bouser/.m2
        //
        athImg.inside("--expose=12345 -p 12345:12345") {
            withEnv(["BLUEO_SELENIUM_SERVER_ADDR=${seleniumIP}"]) {
                try {
                    sh "echo 'Starting build stage'"
                    // Build blueocean and the ATH
                    stage 'build'
                    sh 'rm -rf blueocean-plugin'
                    if (buildNumber == NOT_TRIGGERED) {
                        // This build of the ATH was not triggered from an upstream build of blueocean itself
                        // so we must get and build blueocean.
                        dir('blueocean-plugin') {
                            // Try checking out the Blue Ocean branch having the name supplied by build parameter. If that fails
                            // (i.e. doesn't exist ), just use the default/master branch and run the ATH tests against that.
                            try {
                                git(url: 'https://github.com/jenkinsci/blueocean-plugin.git', branch: "${branchName}")
                                echo "Found a Blue Ocean branch named '${branchName}'. Running ATH against that branch."
                            } catch (Exception e) {
                                echo "No Blue Ocean branch named '${branchName}'. Running ATH against 'master' instead."
                                git(url: 'https://github.com/jenkinsci/blueocean-plugin.git', branch: "master")
                            }
                            // Need test-compile because the rest-impl has a test-jar that we
                            // need to make sure gets compiled and installed for other modules.
                            // Must cd into blueocean-plugin before running build
                            // see https://issues.jenkins-ci.org/browse/JENKINS-33510
                            sh "cd blueocean-plugin && mvn -B clean test-compile install -DskipTests"
                        }
                    } else {
                        // This run was triggered from a build of a Blue Ocean branch. That build already
                        // has the right plugins pre-assembled and archived in a tar on the build.
                        // Let's just extract that tar to where the ATH would expect the plugins to be.
                        step ([$class: 'CopyArtifact',
                               projectName: "blueocean/${branchName}",
                               selector: [$class: 'SpecificBuildSelector', buildNumber: "${buildNumber}"],
                               filter: 'blueocean/target/ath-plugins.tar.gz']);
                        sh 'mkdir -p blueocean-plugin/blueocean'
                        sh 'tar xzf blueocean/target/ath-plugins.tar.gz -C blueocean-plugin/blueocean'
                        // Mark this as a pre-assembly. This tells the run.sh script to
                        // not perform the assembly again.
                        sh 'touch blueocean-plugin/blueocean/.pre-assembly'
                    }
                    sh "mvn -B clean install -DskipTests"

                    // Run the ATH. Tell the run script to not try starting selenium. Selenium is
                    // already running in a docker container of it's on in the host. See call to
                    // ./start-selenium.sh (above) and ./stop-selenium.sh (below).
                    stage 'run'
                    sh "./run.sh -a=./blueocean-plugin/blueocean/ --host=\"`node .printip.js`\" --port=12345 --no-selenium"
                } catch (err) {
                    currentBuild.result = "FAILURE"
                } finally {
                    sendhipchat()
                    //deleteDir()
                }
            }
        }
    } finally {
        sh "./stop-selenium.sh"
    }
}

def sendhipchat() {
    res = currentBuild.result
    if(res == null) {
        res = "SUCCESS"
    }
    message = "ATH: ${env.JOB_NAME} #${env.BUILD_NUMBER}, status: ${res} (<a href='${currentBuild.absoluteUrl}'>Open</a>)"
    color = null
    if(res == "UNSTABLE") {
        color = "YELLOW"
    } else if(res == "SUCCESS"){
        color = "GREEN"
    } else if(res == "FAILURE") {
        color = "RED"
    }
    if(color != null) {
        hipchatSend message: message, color: color
    }
}