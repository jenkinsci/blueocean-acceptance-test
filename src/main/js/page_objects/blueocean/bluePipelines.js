// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

module.exports = {
    url: function () {
        return this.api.launchUrl + '/blue/pipelines';
    },
    elements: {
        pipelines: {
            selector: '.pipelines-table'
        }
    }
};