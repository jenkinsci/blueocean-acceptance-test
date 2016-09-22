#!groovy

node {
    stage 'init'
    //deleteDir()
    checkout scm

    // Need to build the ATH out here so as to get node via
    // the frontend maven plugin
    sh "mvn clean package -DskipTests"
    // Now we can execute a node script to get the local host IP,
    // which we need for running selenium in one docker container
    // and the ATH itself in another.
    sh "PATH=./node node .printip.js > hostip.txt"
    def hostip = readFile 'hostip.txt'

    echo "Host IP: [${hostip}]"

    // Run selenium in a docker container of its own on the host.
    sh "./start-selenium.sh"

    try {
        def athImg = docker.image('blueocean-ath-builder')

        // Expose the port on which the ATH Jenkins instance runs (12345), allowing the
        // Firefox browser (running in the selenium container) to make requests back
        // in etc.
        //
        // To bind in the local ~/.m2 when running in dev mode, simply add the following
        // volume binding to the "inside" container run settings (change username from "tfennelly"):
        //       -v /home/tfennelly/.m2:/home/bouser/.m2
        //
        athImg.inside("--expose=12345 -p 12345:12345 -v /home/tfennelly/.m2:/home/bouser/.m2") {
            withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com', 'GIT_COMMITTER_NAME=Hates', 'GIT_AUTHOR_NAME=Cake', 'GIT_AUTHOR_EMAIL=hates@cake.com', "blueoceanHost=${hostip}"]) {
                try {
                    sh "echo 'Starting build stage'"
                    // Build blueocean and the ATH
                    stage 'build'
                    dir('blueocean-plugin') {
                        git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
                        // Need test-compile because the rest-impl has a test-jar that we
                        // need to make sure gets compiled and installed for other modules.
                        // sh "cd blueocean-plugin && mvn clean test-compile install -DskipTests"
                    }
                    sh "mvn clean install -DskipTests"

                    // Run the ATH. Tell the run script to not try starting selenium. Selenium is
                    // already running in a docker container of it's on in the host. See call to
                    // ./start-selenium.sh (above) and ./stop-selenium.sh (below).
                    stage 'run'
                    sh "./run.sh -a=./blueocean-plugin/blueocean/ --host=\"${hostip}\" --port=12345 --no-selenium"
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
