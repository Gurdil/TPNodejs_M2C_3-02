var forum ={};

forum.start = function ()
{
	document.addEventListener("click", forum.click);
};

forum.click = function (ev)
{
	var src = ev.target;
	if (src.has_class("btn-add-message"))
	{
		forum.add_message();
	}
	else
	{
		console.log("Not found");
	}

};


forum.add_message = function ()
{
	var elt = document.getElementsByClassName("messages-list")[0];
	var a = document.getElementsByClassName("input-message")[0].value;
	var separ = "<div class=\"row separateur\">" + "</div>";
	var d = new Date();
	var date = d.getHours();

	elt.innerHTML += separ + "<div class=\"row message\">"
	+ "<p>" + a + "<p>" + "</div>";
};



function new_thread(info)
{

	var message = document.createElement('div');

	document.getElementById('messages').appendChild(message)

}


window.onload = forum.start;


HTMLElement.prototype.has_class = function (c) {
	return this.className.indexOf(c) >= 0;
};