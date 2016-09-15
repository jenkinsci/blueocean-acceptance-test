#!groovy

node {
  stage 'init'
  //deleteDir()
  checkout scm

  def athImg = docker.image('headless-ath-firefox')
  athImg.inside {
    withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com','GIT_COMMITTER_NAME=Hates','GIT_AUTHOR_NAME=Cake','GIT_AUTHOR_EMAIL=hates@cake.com']) {
      try {
        // Build blueocean and the ATH
        stage 'build'
        dir('blueocean') {
          git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
        }
        sh "cd blueocean && mvn clean install"
        sh "mvn clean install -DskipTests"

        // Run the ATH
        stage 'run'
        sh "./run.sh -a=./blueocean/blueocean/"

      } catch(err) {
        currentBuild.result = "FAILURE"
      } finally {
        //deleteDir()
      }
    }
  }
}
