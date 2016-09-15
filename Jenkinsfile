#!groovy

node {
  stage 'init'
  deleteDir()
  checkout scm

  def athImg = docker.image('headless-ath-firefox')
  athImg.inside("-v /Users/tfennelly/projects:/projects") {
    withEnv(['GIT_COMMITTER_EMAIL=me@hatescake.com','GIT_COMMITTER_NAME=Hates','GIT_AUTHOR_NAME=Cake','GIT_AUTHOR_EMAIL=hates@cake.com']) {
      try {
        // Run the ATH
        stage 'run'
        sh "cd /projects/blueocean-acceptance-test-harness && ./run.sh -a=../blueocean/blueocean/"

      } catch(err) {
        currentBuild.result = "FAILURE"
      } finally {
        deleteDir()
      }
    }
  }
}
