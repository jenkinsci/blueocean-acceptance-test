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
        dir('target/blueocean-plugin') {
          git url: 'https://github.com/jenkinsci/blueocean-plugin.git'
          sh "echo --------"
          sh "echo ${pwd()}"
          sh "ls -al target/blueocean-plugin"
          sh "echo --------"
        }
        sh "echo ${pwd()}"
        sh "ls -al"
        sh "echo --------"

      } catch(err) {
        currentBuild.result = "FAILURE"
      } finally {
        //deleteDir()
      }
    }
  }
}
