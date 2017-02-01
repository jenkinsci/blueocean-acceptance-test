node {
    stage "hey"
    sh "echo yeah"

    stage "parallel"

    parallel firstBranch: {
        sh 'echo `date` Stage 2 - firstBranch www.spiegel.de'
        sh 'ping -c 3 -i 3 www.spiegel.de || true'

    }, secondBranch: {
        sh 'echo `date` Stage 2 - secondBranch www.stern.de'
        sh 'ping -c 5 -i 2 www.stern.de || true'
    }

    stage "ho"
    sh "echo done"
}
