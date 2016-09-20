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

    // Run selenium in a docker container of its own on the host.
    sh "./start-selenium.sh"

    try {
        def athImg = docker.image('blueocean-ath-builder')

        // Expose the port on which the ATH Jenkins instance runs (12345), allowing the
        // Firefox browser (running in the selenium container) to make requests back
        // in etc.
        athImg.inside("--expose=12345") {
            withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com', 'GIT_COMMITTER_NAME=Hates', 'GIT_AUTHOR_NAME=Cake', 'GIT_AUTHOR_EMAIL=hates@cake.com']) {
                try {
                    // Build blueocean and the ATH
                    stage 'build'
                    dir('blueocean-plugin') {
                        git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
                        // Need test-compile because the rest-impl has a test-jar that we
                        // need to make sure gets compiled and installed for other modules.
                        sh "cd blueocean-plugin && mvn clean test-compile install -DskipTests"
                    }
                    sh "mvn clean install -DskipTests"

                    // Run the ATH
                    stage 'run'
                    sh "./run.sh -a=./blueocean-plugin/blueocean/ --host=${hostip} --port=12345"
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
