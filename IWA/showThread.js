/**
 * Created by ESME on 08/12/2014.
 */



/*----Récupération de l'ID du thread dans l'url----*/
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



/*----Récupération du fil de discussion sur le serveur----*/
get = function(req, cb) 
{   
    //on cree une variable en format XMLhttp
    var xhr = new XMLHttpRequest();
    //on ouvre l URL ,la requet est de facon asynchrone 
    xhr.open("GET", req, true);
    //quand l ouverture et prete on change la valeur par cb
    xhr.onreadystatechange = cb;
    //on envoi la toute la donner avec le changement 
    xhr.send();
};

var data=[];
var showMessages;
cb_messages = function ()
{
    //var data=[];
    if (this.readyState == 4 && this.status == 200) 
    {   
        data= JSON.parse(this.responseText).thread;
        display_content(data);
    }
};


get_messages = function (url)
{  
    var req="http://tp-iwa.waxo.org/show_thread?id=" + url.searchObject.id;
    get(req, cb_messages);
};


/*----Affichage des messages----*/
var compteur=0;
display_content = function (data)
{  
    var post=[];

    for (var i=0; i<data.length; ++i)
    {

        post[i] = new parserMessage(data[i]);

    }
	
	/**var threadArray=[];

    threadArray=data;

    
    var div = document.getElementById("discussions");
    var html = "";

    for (var i=0; i<threadArray.length; ++i)
    {

        div.innerHTML += "<div class=\"row message\">" + "<p>" + threadArray[i] + "<p>" + "</div>";
        compteur++;
        
    }**/

};


/*-----Récupération des infos des messages-----*/
var parserMessage;

parserMessage = function (messageThread) {
    this.messageThread = messageThread;

    var tagName = "VIDEO";
    var result;

    var message = this.messageThread;
    do
    {
        var regVideo = new RegExp("\\[" + tagName + "\\](.+?)\\[\\/" + tagName + "\\]", "g");
        result = regVideo.exec(message);
        if (result == null) {
            break;
        }

        message = message.slice(result.index + result[0].length);

        var regCodeVideo = new RegExp("v=(.+?)(&|$)", "g");
        var codeVideo = regCodeVideo.exec(result[1]);

        this.messageThread = this.messageThread.replace(result[0], '<p><iframe  width="560" height="315" src="//www.youtube.com/embed/' + codeVideo[1] + '" frameborder="0"' + "allowfullscreen>" + "</iframe></p>");

    } while (true);

    //this.parseBalise("author", '<p><h1>$1</h1></p>');

    this.author = "";
    this.author = this.extractBalise("author");

    this.title = "";
    this.title = this.extractBalise("title")

    this.parseBalise("IMG", '<p><img src="$1"></p>');

    var elt = document.getElementsByClassName("messages-list")[0];
    elt.innerHTML +='<div class="row message">' + '<p><h1>' + this.author + '</h1></p>' + '<p>' + this.title + '</p>' + this.messageThread + '</div>';
};

parserMessage.prototype.extractBalise = function(tagName)
{
    var reg = new RegExp("\\[" + tagName + "\\](.+?)\\[\\/" + tagName + "\\]", "gi");
    var sauvegarde = reg.exec(this.messageThread);

    if (sauvegarde != null)
    {
        this.messageThread = this.messageThread.replace(sauvegarde[0], "");
        return sauvegarde[1];
    }
    else
    {
        return "";
    }
};

parserMessage.prototype.parseBalise = function(tagName, html)
{
    var reg = new RegExp("\\["+tagName+"\\](.+?)\\[\\/"+tagName+"\\]", "gi");
    this.messageThread = this.messageThread.replace(reg, html);
};






var start = function()
{
    var currentLocation =  document.location.href;

    var url = parseURL(currentLocation);
	
	get_messages(url);
};

window.onload = start;