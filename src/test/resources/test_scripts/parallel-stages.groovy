node {
    stage "hey"
    sh "echo yeah"

    stage "parallel"

    parallel firstBranch: {
        sh 'echo `date` Stage 2 - firstBranch www.spiegel.de'
        sh 'ping -c 7 -i 3 localhost'

    }, secondBranch: {
        sh 'echo `date` Stage 2 - secondBranch www.stern.de'
        sh 'ping -c 12 -i 2 localhost'
    }

    stage "ho"
    sh "echo done"
}
