var sseClient = require('@jenkins-cd/sse-gateway/headless-client');
var jobChannel = undefined;
var jobEventListeners = [];
var jobEventHistory = [];
var sseConnection;

/**
 * Connect to the SSE Gateway.
 * <p>
 * DO NOT CALL: done automatically in the globals.
 *
 * @param browser
 * @param done
 */
exports.connect = function(browser, done) {
    if (sseConnection) {
        exports.disconnect(function() {
            exports.connect(browser, done);
        });
    } else {
        sseConnection = sseClient.connect({
            clientId: 'blueocean-acceptance-tests',
            jenkinsUrl: browser.launchUrl,
            onConnect: function() {
                console.log('Connected to the Jenkins SSE Gateway.');

                // Subscribe to job channel so we have it ready to listen 
                // before any tests start running.
                jobChannel = sseConnection.subscribe({
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
};

/**
 * Disconnect from the SSE Gateway.
 * <p>
 * DO NOT CALL: done automatically in the globals.
 *
 * @param {Function} [onDisconnected] - callback to be invoke when finished, will pass the sse event to the callback
 */
exports.disconnect = function(onDisconnected) {
    function clientDisconnect() {
        if (sseConnection) {
            sseConnection.disconnect();
        }
        sseConnection = undefined;
        jobEventListeners = [];
        jobEventHistory = [];
        console.log('Disconnected from the Jenkins SSE Gateway.');
        if (onDisconnected) {
            onDisconnected();
        }
    }

    if (jobChannel) {
        sseConnection.unsubscribe(jobChannel, function() {
            jobChannel = undefined;
            clientDisconnect();
        });
    } else {
        clientDisconnect();
    }
};

exports.onJobEvent = function(filter, callback, checkEventHistory) {
    if(typeof checkEventHistory === 'boolean' ? checkEventHistory : true) {
        var sendHistoricalEvent = function(event) {
            setTimeout(function() {
                callback(event);
            }, 1);
        };
        for (var i = 0; i < jobEventHistory.length; i++) {
            if (isMatchingEvent(jobEventHistory[i], filter)) {
                // If we find a matching event in the event history then we
                // create a timeout to send the event to the callback and then
                // bail immediately, without adding the listener to the list
                // of job listeners.
                sendHistoricalEvent(jobEventHistory[i]);
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

exports.onJobCreated = function(jobName, callback) {
    exports.onJobEvent({
        jenkins_event: 'job_crud_created',
        job_name: jobName
    }, callback);
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