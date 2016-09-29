#!groovy

node ('docker') {

    def DEFAULT_REPO = 'https://github.com/jenkinsci/blueocean-plugin.git'
    def NO_BUILD_NUM = ''


    // Allow the pipeline to be built with parameters, defaulting the
    // Blue Ocean branch name to be that of the ATH branch name. If no such branch
    // of Blue Ocean exists, then the ATH will just run against the master branch of
    // Blue Ocean.
    properties([parameters([
            string(name: 'BLUEOCEAN_REPO_URL', defaultValue: DEFAULT_REPO, description: 'The Blue Ocean repository against which the tests on this ATH branch will run. If you want to validate a fork, you can change this.'),
            string(name: 'BLUEOCEAN_BRANCH_NAME', defaultValue: "${env.BRANCH_NAME}", description: 'Blue Ocean branch name (on the above repository) against which the tests on this ATH branch will run.'),
            string(name: 'BUILD_NUM', defaultValue: NO_BUILD_NUM, description: 'The Blue Ocean build number from the CI server. Used to get pre-assembled Jenkins plugins Vs building (see above repo settings). Use a valid build number, or "latest" to get artifacts from the latest build. Otherwise just leave blank (default value). Uses the above BLUEOCEAN_BRANCH_NAME to determine the upstream build Job name from which to get the pre-assembled archives.')
    ]), pipelineTriggers([])])

    def repoUrl;
    def branchName;
    def buildNumber;
    try {
        repoUrl = "${BLUEOCEAN_REPO_URL}"
        branchName = "${BLUEOCEAN_BRANCH_NAME}"
        buildNumber = "${BUILD_NUM}"
    } catch (e) {
        echo "********************************************************************************************"
        echo "The build parameters for this branch are not yet initialized (or were modified)."
        echo "Will attempt to run the ATH against the pre-assembled HPIs from the latest build of master."
        echo "********************************************************************************************"
        repoUrl = DEFAULT_REPO
        branchName = "master"
        buildNumber = "latest"
    }

    stage 'init'
    checkout scm

    // Run selenium in a docker container of its own on the host.
    sh "./start-selenium.sh"

    try {
        // Build an image from the the local Dockerfile
        def athImg = docker.build('blueocean-ath-builder')

        //
        // Run the build container, giving it the same network stack as the selenium
        // container.
        //
        // To bind in the local ~/.m2 when running in dev mode, simply add the following
        // volume binding to the "inside" container run settings (change username from "tfennelly"):
        //       -v /home/tfennelly/.m2:/home/bouser/.m2
        //
        athImg.inside("--net=container:blueo-selenium") {
            try {
                sh "echo 'Starting build stage'"
                // Build blueocean and the ATH
                stage 'build'
                if (buildNumber == NO_BUILD_NUM) {
                    // This build of the ATH was not triggered from an upstream build of blueocean itself
                    // so we must get and build blueocean.
                    dir('blueocean-plugin') {
                        // Try checking out the Blue Ocean branch having the name supplied by build parameter. If that fails
                        // (i.e. doesn't exist ), just use the default/master branch and run the ATH tests against that.
                        try {
                            git(url: "${repoUrl}", branch: "${branchName}")
                            echo "Found a Blue Ocean branch named '${branchName}'. Running ATH against that branch."
                        } catch (Exception e) {
                            echo "No Blue Ocean branch named '${branchName}'. Running ATH against 'master' instead."
                            branchName = "master";
                            git(url: 'https://github.com/jenkinsci/blueocean-plugin.git', branch: "master")
                        }
                        // Need test-compile because the rest-impl has a test-jar that we
                        // need to make sure gets compiled and installed for other modules.
                        // Must cd into blueocean-plugin before running build
                        // see https://issues.jenkins-ci.org/browse/JENKINS-33510
                        sh "cd blueocean-plugin && mvn -B clean test-compile install -DskipTests"
                    }
                } else {
                    def selector;

                    // Get the ATH plugin set from an upstream build of the "blueocean" job. All blueocean builds
                    // already have the plugins pre-assembled and archived in a tar on the build.
                    if (buildNumber.toLowerCase() == "latest") {
                        selector = [$class: 'LastCompletedBuildSelector'];
                    } else {
                        // Get from a specific build number. This run may have been triggered from a
                        // build of a Blue Ocean branch.
                        selector = [$class: 'SpecificBuildSelector', buildNumber: "${buildNumber}"];
                    }

                    // Let's copy and extract that tar to where the ATH would expect the plugins to be.
                    // Try checking out the Blue Ocean branch having the name supplied by build parameter. If that fails
                    // (i.e. doesn't exist ), just use the default/master branch and run the ATH tests against that.
                    try {
                        step ([$class: 'CopyArtifact',
                               projectName: "blueocean/${branchName}",
                               selector: selector,
                               filter: 'blueocean/target/ath-plugins.tar.gz']);
                    } catch (Exception e) {
                        echo "No CI build for Blue Ocean branch named '${branchName}', or doesn't have a pre-assembled plugin tar. Trying the 'master' build instead."
                        branchName = "master";
                        step ([$class: 'CopyArtifact',
                               projectName: "blueocean/master",
                               selector: selector,
                               filter: 'blueocean/target/ath-plugins.tar.gz']);
                    }
                    sh 'mkdir -p blueocean-plugin/blueocean'
                    sh 'tar xzf blueocean/target/ath-plugins.tar.gz -C blueocean-plugin/blueocean'
                    // Mark this as a pre-assembly. This tells the run.sh script to
                    // not perform the assembly again.
                    sh 'touch blueocean-plugin/blueocean/.pre-assembly'
                }
                sh "mvn -B clean install -DskipTests"

                // Run the ATH. Tell the run script to not try starting selenium. Selenium is
                // already running in a docker container of it's on in the host. See call to
                // ./start-selenium.sh (above) and ./stop-selenium.sh (below).
                stage 'run'
                sh "./run.sh -a=./blueocean-plugin/blueocean/ --no-selenium"
            } catch (err) {
                currentBuild.result = "FAILURE"
            } finally {
                sendhipchat(repoUrl, branchName)
            }
        }
    } finally {
        sh "./stop-selenium.sh"
    }
}

def sendhipchat(repoUrl, branchName) {
    res = currentBuild.result
    if(res == null) {
        res = "SUCCESS"
    }

    def shortRepoURL = toShortRepoURL(repoUrl);
    def repoBranchURL = toRepoBranchURL(repoUrl, branchName);
    message = "ATH: ${env.JOB_NAME} #${env.BUILD_NUMBER}<br/>"
    message += "- run against: <a href='${repoBranchURL}'>${shortRepoURL}:${branchName}</a><br/>"
    message += "- result: ${res} (<a href='${currentBuild.absoluteUrl}'>Open</a>)"

    color = null
    if(res == "UNSTABLE") {
        color = "YELLOW"
    } else if(res == "SUCCESS"){
        color = "GREEN"
    } else if(res == "FAILURE") {
        color = "RED"
    }
    if(color != null) {
        hipchatSend message: message, color: color
    }
}

def toShortRepoURL(repoURL) {
    def parsedReproUri = new URI(repoURL)
    def repoPath = parsedReproUri.getPath();

    if (repoPath.startsWith("/")) {
        repoPath = repoPath.substring(1);
    }
    repoPath = repoPath.replace('.git', '');

    return repoPath;
}

def toRepoBranchURL(repoURL, branchName) {
    def repoBranchURL = repoURL;

    repoBranchURL = repoBranchURL.replace('.git', '');
    repoBranchURL += '/tree/' + branchName;

    return repoBranchURL;
}
