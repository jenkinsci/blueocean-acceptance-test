#!groovy

node {
  stage 'init'
  deleteDir()
  checkout scm

  stage 'run build'
  def athImg = docker.image('headless-ath-firefox')
  athImg.inside {
    withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com','GIT_COMMITTER_NAME=Hates','GIT_AUTHOR_NAME=Cake','GIT_AUTHOR_EMAIL=hates@cake.com']) {
      try {
        // Get and build blueocean
        dir('blueocean') {
          git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
          sh "mvn clean install -DskipTests"
        }

        // Build the ATH itself
        sh "mvn clean install -DskipTests"

        sh "./run.sh"

      } catch(err) {
        currentBuild.result = "FAILURE"
      } finally {
        deleteDir()
      }
    }
  }
}
