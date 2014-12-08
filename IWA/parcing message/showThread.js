/**
 * Created by ESME on 08/12/2014.
 */


var showThread = {};

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

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


showThread.postMessage = function ()
{
    var a = document.getElementsByClassName("messageField")[0].value;
    httpGet('http://tp-iwa.waxo.org/reply_to_thread?id=' + parseURL(document.location.href).searchObject.id + '&info=' + a);

};

showThread.click = function (ev)
{
    var src = ev.target;
    if (src.has_class("buttonSubmitMessage"))
    {
        showThread.postMessage();
    }
    else
    {
        console.log("Not Found");
    }
};

var start = function()
{
    document.addEventListener("click", showThread.click);

    var currentLocation =  document.location.href;
    console.log(currentLocation);

    var url = parseURL(currentLocation);

    var elt = document.getElementsByClassName("todo")[0];
    elt.innerHTML +="<p>" + "I'm the thread :" + url.searchObject.id + "</p>";
};

window.onload = start;

HTMLElement.prototype.has_class = function(c)
{
    return this.className.indexOf(c) >= 0;
};