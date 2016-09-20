#!groovy

node {
    stage 'init'
    //deleteDir()
    checkout scm

    sh "PATH=./node node .printip.js > hostip.txt"
    def hostip = readFile 'hostip.txt'

    def athImg = docker.image('blueocean-ath-builder')

    // Run selenium in a docker container of its own on the host.
    //
    sh "./start-selenium.sh"

    // Build blueocean and the ATH
    stage 'build'
    dir('blueocean-plugin') {
        git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
        sh "mvn clean install"
    }
    sh "mvn clean install -DskipTests"

    try {
        // Expose the port on which the ATH Jenkins instance runs (12345), allowing the
        // Firefox browser (running in the selenium container) to make requests back
        // in etc.
        athImg.inside("--expose=12345") {
            withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com', 'GIT_COMMITTER_NAME=Hates', 'GIT_AUTHOR_NAME=Cake', 'GIT_AUTHOR_EMAIL=hates@cake.com']) {
                try {
//
//                    // Build blueocean and the ATH
//                    stage 'build'
//                    dir('blueocean-plugin') {
//                        git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
//                        sh "cd blueocean-plugin && mvn clean install"
//                    }
//                    sh "mvn clean install -DskipTests"

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
