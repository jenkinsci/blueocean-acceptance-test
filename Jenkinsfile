#!groovy

node ('docker') {
    stage 'init'
    //deleteDir()
    checkout scm

    // Run selenium in a docker container of its own on the host.
    // It will export BLUEO_SELENIUM_SERVER_ADDR
    sh "source start-selenium.sh"

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
        athImg.inside("--expose=12345 -p 12345:12345 -v /home/tfennelly/.m2:/home/bouser/.m2") {
            withEnv(["BLUEO_SELENIUM_SERVER_ADDR=${BLUEO_SELENIUM_SERVER_ADDR}"]) {
                try {
                    sh "echo 'Starting build stage'"
                    // Build blueocean and the ATH
                    stage 'build'
                    dir('blueocean-plugin') {
                        git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
                        // Need test-compile because the rest-impl has a test-jar that we
                        // need to make sure gets compiled and installed for other modules.
                        // sh "cd blueocean-plugin && mvn -B clean test-compile install -DskipTests"
                    }
                    sh "mvn -B clean install -DskipTests"

                    // Run the ATH. Tell the run script to not try starting selenium. Selenium is
                    // already running in a docker container of it's on in the host. See call to
                    // ./start-selenium.sh (above) and ./stop-selenium.sh (below).
                    stage 'run'
                    sh "./run.sh -a=./blueocean-plugin/blueocean/ --host=\"`node .printip.js`\" --port=12345 --no-selenium"
                } catch (err) {
                    sh "echo '${err.message}'"
                    currentBuild.result = "FAILURE"
                } finally {
                    //deleteDir()
                }
            }
        }
    } finally {
        sh "./stop-selenium.sh"
    }
}
