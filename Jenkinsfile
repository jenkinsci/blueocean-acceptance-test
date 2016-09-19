#!groovy

node {
    stage 'init'
    //deleteDir()
    checkout scm

    try {
        // Build blueocean and the ATH
        stage 'build'
        dir('blueocean-plugin') {
          git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
          sh "mvn clean install -DskipTests"
        }
        sh "mvn clean install -DskipTests"

        // Run the ATH
        stage 'run'
        sh "./run.sh -a=./blueocean-plugin/blueocean/"
    } catch (err) {
        currentBuild.result = "FAILURE"
    } finally {
        //deleteDir()
    }
}
