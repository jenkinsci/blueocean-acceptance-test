node {
    echo 'first step'
    sh 'sleep 3; echo `date` first;'
    echo 'first step end'
    echo 'Second coming up'
    sh 'sleep 2; echo `date` second;'
    echo 'third now'
    sh 'sleep 1; echo `date` third;'
    echo '4th'
    sh 'sleep 4; echo `date` fourth;'
    echo 'last 5th'
    sh 'echo `date` fifth;'
    echo 'and we are finished'
    sh 'echo end'
    sh '''#!/bin/bash -l
    echo $0
    COUNTER=0
    while [  $COUNTER -lt 10001 ]; do
     echo The counter is $COUNTER
     let COUNTER=COUNTER+1
    done
    sleep 2;
    '''

}