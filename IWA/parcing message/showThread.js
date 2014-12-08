/**
 * Created by ESME on 08/12/2014.
 */




function parseURL(url)
{
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
};

var start = function()
{
    var currentLocation =  document.location.href;
    console.log(currentLocation);

    var url = parseURL(currentLocation);

    var elt = document.getElementsByClassName("todo")[0];
    elt.innerHTML +="<p>" + "I'm the thread :" + url.searchObject.id + "</p>";
};

window.onload = start;