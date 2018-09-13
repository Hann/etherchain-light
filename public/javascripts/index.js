$(function(){
    function parseQuery(queryString) {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        delete query[''];
        return query;
    }
            
    $("#one-page-select").change(function(e) {
        var selected = $(this).val();
        var params = parseQuery(window.location.search);
        params['blocks'] = selected;
        var encoded = $.param(params, true);
        
        var url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + window.location.pathname + "?" + encoded;
        window.location = url;
    });
});