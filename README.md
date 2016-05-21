Acceptance test harness for Blue Ocean

# Running
This acceptance test harness builds directly on the main Jenkins [acceptance-test-harness](https://github.com/jenkinsci/acceptance-test-harness),
so running it works as per the instrictions on the README.md there.

We also added a shortcut script here for running:

```sh
./run.sh
```

That script will download a recent version of Jenkins from the download mirror (see script) and will run the acceptance
tests. Alternatively, you can specify the the version of Jenkins that you want to test against e.g. to run the tests
against Jenkins version `2.4`:
 
```sh
./run.sh 2.4
``` 