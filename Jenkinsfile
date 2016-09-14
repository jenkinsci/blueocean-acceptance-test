#!groovy

node {
  deleteDir()
  checkout scm

  docker.image('headless-ath').inside {
    withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com','GIT_COMMITTER_NAME=Hates','GIT_AUTHOR_NAME=Cake','GIT_AUTHOR_EMAIL=hates@cake.com']) {
      try {
      } catch(err) {
        currentBuild.result = "FAILURE"
      } finally {
        deleteDir()
      }
    }
  }
}
