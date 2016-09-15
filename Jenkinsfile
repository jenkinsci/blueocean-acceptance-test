#!groovy

node {
  stage 'init'
  deleteDir()
  checkout scm

  def athImg = docker.image('headless-ath-firefox')
  // "-v ~/.m2:~/.m2"
  sh 'echo `pwd`'
  athImg.inside() {
    withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com','GIT_COMMITTER_NAME=Hates','GIT_AUTHOR_NAME=Cake','GIT_AUTHOR_EMAIL=hates@cake.com']) {
        sh 'echo `pwd`'
    }
  }
}
