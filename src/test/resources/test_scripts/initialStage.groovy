node {
  sh 'ping -c 5 www.spiegel.de'
  stage ('Build1') {
      sh 'ping -c 5 www.spiegel.de'
  }
  stage ('Build2') {
      sh 'ping -c 5 www.spiegel.de'
  }
}