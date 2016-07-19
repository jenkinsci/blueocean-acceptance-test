var sseClient = require('@jenkins-cd/sse-gateway/headless-client');
var jobChannel = undefined;
var jobEventListeners = [];
var jobEventHistory = [];

/**
 * Connect to the SSE Gateway.
 * <p>
 * DO NOT CALL: done automatically in the globals.
 */
exports.connect = function(browser, done) {
    if (jobChannel) {
        exports.disconnect(function() {
            exports.connect(browser, done);
        });
    } else {
        sseClient.connect({
            clientId: 'blueocean-acceptance-tests',
            jenkinsUrl: browser.launchUrl,
            onConnect: function() {
                browser.sseClient = sseClient;

                console.log('Connected to the Jenkins SSE Gateway.');

                // Subscribe to job channel so we have it ready to listen 
                // before any tests start running.
                jobChannel = sseClient.subscribe({
                    channelName: 'job',
                    onEvent: function (event) {
                        callJobEventListeners(event);
                    },
                    onSubscribed: function () {
                        console.log('Subscribed to the "job" event channel.');
                        done();
                    }
                });
            }
        });
    }
    browser.sseClient = sseClient;
};

/**
 * Disconnect from the SSE Gateway.
 * <p>
 * DO NOT CALL: done automatically in the globals.
 */
exports.disconnect = function(onDisconnected) {
    function clientDisconnect() {
        sseClient.disconnect();
        jobEventListeners = [];
        jobEventHistory = [];
        console.log('Disconnected from the Jenkins SSE Gateway.');
    }

    if (jobChannel) {
        sseClient.unsubscribe(jobChannel, function() {
            try {
                jobChannel = undefined;
                clientDisconnect();
            } finally {
                if (onDisconnected) {
                    onDisconnected();
                }
            }
        });
    } else {
        clientDisconnect();
    }
};

exports.onJobEvent = function(filter, callback, checkEventHistory) {
    if(typeof checkEventHistory === 'boolean' ? checkEventHistory : true) {
        for (var i = 0; i < jobEventHistory.length; i++) {
            if (isMatchingEvent(jobEventHistory[i], filter)) {
                // If we find a matching event in the event history then we
                // create a timeout to send the event to the callback and then
                // bail immediately, without adding the listener to the list
                // of job listeners.
                setTimeout(function() {
                    callback(jobEventHistory[i]);
                }, 50);
                return;
            }
        }
    }

    var listener = {
        filter: filter,
        callback: callback
    };
    
    jobEventListeners.push(listener);
};

exports.onJobRunStarted = function(jobName, callback, runId) {
    exports.onJobEvent({
        jenkins_event: 'job_run_started',
        job_name: jobName,
        jenkins_object_id: (runId ? runId.toString() : '1')
    }, callback);
};

exports.onJobRunEnded = function(jobName, callback, runId) {
    exports.onJobEvent({
        jenkins_event: 'job_run_ended',
        job_name: jobName,
        jenkins_object_id: (runId ? runId.toString() : '1')
    }, callback);
};

function callJobEventListeners(event) {
    try {
        var newListenerList = [];
        for (var i = 0; i < jobEventListeners.length; i++) {
            var jobEventListener = jobEventListeners[i];

            if (isMatchingEvent(event, jobEventListener.filter)) {
                try {
                    jobEventListener.callback(event);
                } catch(e) {
                    console.error(e);
                }
            } else {
                // Only add the handlers that were not called.
                newListenerList.push(jobEventListener);
            }
        }
        jobEventListeners = newListenerList;
    } finally {
        jobEventHistory.push(event);
    }
}

// Check the event against the event filter.
function isMatchingEvent(event, eventFilter) {
    for (var prop in eventFilter) {
        if (eventFilter.hasOwnProperty(prop) && eventFilter[prop] !== event[prop]) {
            return false;
        }
    }
    return true;
}