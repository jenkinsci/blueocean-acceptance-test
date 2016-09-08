pipeline {
  agent label:""
  stages {
    stage ('Stage 1'){
           sh 'sleep 3; echo `date` Stage 1;'
           sh 'sleep 3; echo `date` Stage 1;'
       }

        stage ('fin'){
            sh 'echo `date` fin;sleep 3; echo `date` fin;'
            sh 'echo yeah > foo.txt'
            archiveArtifacts 'foo.txt'
        }
  }

}