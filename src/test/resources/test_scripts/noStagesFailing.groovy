node {
    echo 'first step'
    sh 'ping -c 3 localhost; echo `date` first;'
    echo 'first step end'
    echo 'Second coming up'
    sh 'ping -c 3 localhost; echo `date` second;'
    echo '9th'
    sh 'ping -c 3 localhost; echo `date`;'
    echo '10th'
    sh 'ping -c 3 localhost; echo `date`;'
    echo 'and we are finished'
    sh 'echo end; error 1'
}
