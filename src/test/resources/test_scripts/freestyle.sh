#!/usr/bin/env bash
echo `date` freeStyle start;
sleep 2;
echo `date` step 1;
sleep 1;
echo `date` step 2;
sleep 2;
echo `date` step 3;
sleep 2;
echo `date` freeStyle end;
COUNTER=0
while [  $COUNTER -lt 10001 ]; do
 echo The counter is $COUNTER
 let COUNTER=COUNTER+1
done