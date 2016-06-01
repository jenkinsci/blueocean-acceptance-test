Acceptance tests for Blue Ocean

# Running
Builds directly on the main Jenkins [acceptance-test-harness](https://github.com/jenkinsci/acceptance-test-harness),
so running it works as per the instructions on the README.md there.

We also added a shortcut script for easy running:

```sh
./run.sh -a=<aggregator-plugin-path>
```

The `-a` (or `--aggregator`) switch is the path to the Blue Ocean aggregator plugin
(e.g. `/Users/tfennelly/projects/blueocean/blueocean-plugin`). This switch is needed until such time as the
Blue Ocean plugins are in the Update Center.

That script will download a recent version of Jenkins from the download mirror (see script) and will run the acceptance
tests. Alternatively, you can specify the the version of Jenkins that you want to test against e.g. to run the tests
against Jenkins version `2.4` (again, it will download that version of Jenkins if it doesn't already have it in the
`wars` directory):
 
```sh
./run.sh --version=2.4 -a=<aggregator-plugin-path>
```

# Running in dev mode

When running in normal mode, tests are run via JUnit and `BOJUnitTest`
(which uses the `JenkinsAcceptanceTestRule`) from the main acceptance test harness. This is good
when running all of the tests because it launches a clean Jenkins (clean `JENKINS_HOME` etc) for every
run. The downside to this however is that it's not such an easy model to use when developing tests
because of the overhead of starting a new Jenkins every time.

For this we have a "dev" mode option which allows you to run a Jenkins in the background, keep it
running and then, in another terminal, to run [nightwatch] commands (a Selenium JS framework) to
run tests quickly as you are writing them.

To run in dev mode, simply add the `--dev` (or just `-d`) switch e.g.
 
```sh
./run.sh -a=<aggregator-plugin-path> --dev
```

An example of one of the [nightwatch] test scripts is [smoke.js](src/test/js/smoke.js). It is hooked into
the main (maven) build via [SimpleSmokeTest.java](src/test/java/io/jenkins/blueocean/SimpleSmokeTest.java),
but to run [smoke.js](src/test/js/smoke.js) while running in dev mode, simply run:

```sh
nightwatch src/test/js/smoke.js
```

Of course this assumes you have the [nightwatch] package globally installed (`npm install -g nightwatch`).
Alternatively, you can just run `npm test` to run all [nightwatch] tests.

[nightwatch]: http://nightwatchjs.org/
