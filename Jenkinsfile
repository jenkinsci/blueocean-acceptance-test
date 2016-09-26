#!groovy

node ('docker') {

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
                    dir('blueocean-plugin') {
                        try {
                            git (url: 'https://github.com/jenkinsci/blueocean-plugin.git', branch: "${env.BRANCH_NAME}")
                        } catch (Exception e) {
                            echo "No Blue Ocean branch named '${env.BRANCH_NAME}'. Running against 'master' instead."
                        }
                        // Need test-compile because the rest-impl has a test-jar that we
                        // need to make sure gets compiled and installed for other modules.
                        // Must cd into blueocean-plugin before running build
                        // see https://issues.jenkins-ci.org/browse/JENKINS-33510
                        sh "cd blueocean-plugin && echo `cat TOM-TEST-BRANCH.txt`"
                        sh "cd blueocean-plugin && git branch"
                        sh "cd blueocean-plugin && mvn -B clean test-compile install -DskipTests"
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
                    //deleteDir()
                }
            }
        }
    } finally {
        sh "./stop-selenium.sh"
    }
}
