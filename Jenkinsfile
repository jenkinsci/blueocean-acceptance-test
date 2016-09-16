#!groovy

node {
  stage 'init'
  //deleteDir()
  checkout scm

  def athImg = docker.image('blueocean-ath-firefox')
  athImg.inside {
    withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com','GIT_COMMITTER_NAME=Hates','GIT_AUTHOR_NAME=Cake','GIT_AUTHOR_EMAIL=hates@cake.com']) {
      try {
        // Build blueocean and the ATH
        stage 'build'
        dir('blueocean-plugin') {
          git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
          //
          // Must cd into blueocean-plugin before running build
          // see https://issues.jenkins-ci.org/browse/JENKINS-33510
          // TODO: figure out why rest-impl tests fail and then remove -DskipTests
          sh "cd blueocean-plugin && mvn clean install -DskipTests"
        }
        sh "mvn clean install -DskipTests"

        // Run the ATH
        stage 'run'
        sh "./run.sh -a=./blueocean-plugin/blueocean/"
      } catch(err) {
        currentBuild.result = "FAILURE"
      } finally {
        //deleteDir()
      }
    }
  }
}
