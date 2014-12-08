/**
 * Created by ESME on 07/12/2014.
 */

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

    var elt = document.getElementsByClassName("add")[0];
    elt.innerHTML +="<li>" + "<p><h1>" + this.author + "</h1></p>" + "<p>" + this.title + "</p>" + this.messageThread + "</li>";
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

HTMLElement.prototype.has_class = function(c)
{
    return this.className.indexOf(c) >= 0;
};

var start = function()
{
    var message1 = new parserMessage("[author]JB[/author]Regarde çà : [IMG]http://www.gamekrazie.com/wp-content/uploads/2014/05/sephiroth.jpg[/IMG]  [VIDEO]https://www.youtube.com/watch?v=-sEk2sNBhcE&channel=joueurdugrenier[/VIDEO]");
    var message2 = new parserMessage("[author]Yann[/author]Sympa et çà : [IMG]http://www.finaland.com/ff_fanatics/11-01-21/yuna.jpg[/IMG] [VIDEO]https://www.youtube.com/watch?v=Rz5mjngf1Mg&channel=joueurdugrenier[/VIDEO]");
}

window.onload = start;