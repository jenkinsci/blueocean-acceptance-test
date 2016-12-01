node {
  sh 'ping -c 5 www.spiegel.de'
  stage ('Build1') {
      sh 'ping -c 5 www.spiegel.de'
  }
  stage ('Build2') {
      sh 'ping -c 5 www.spiegel.de'
  }
  stage ('Build3') {
      sh 'ping -c 5 www.spiegel.de'
  }
  stage ('Build4') {
      sh 'ping -c 5 www.spiegel.de'
  }
  stage ('Build5') {
      sh 'ping -c 5 www.spiegel.de'
  }
}