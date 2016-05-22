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