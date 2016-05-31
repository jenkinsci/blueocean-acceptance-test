
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.window = {};
window.EventSource = require('eventsource');

exports.connect = function(launchUrl, clientId, onConnect) {
    var sseGateway = require('@jenkins-cd/sse-gateway');
    sseGateway.connect({
        clientId: clientId,
        jenkinsUrl: launchUrl,
        onConnect: function() {
            if (onConnect) {
                onConnect(sseGateway);
            }
        }
    });
    
    return sseGateway;
};
