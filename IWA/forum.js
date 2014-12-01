var forum ={};

forum.start = function ()
{
	document.addEventListener("click", forum.click);
};

forum.click = function (ev)
{
	var src = ev.target;
	if (src.has_class("btn-add"))
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
	var elt = document.getElementsClassName("messages-list")[0];
	var a = document.getElementsByClassName("input-message")[0].value;
	elt.innerHTML += "<li>" + a + "</li>";
};



function new_thread(info)
{

	var message = document.createElement('div');

	document.getElementById('messages').appendChild(message)

}


function get _threads(){}

function show_thread(id){}

function reply_to_thread(id, info){}


function delete_thread(id){}


window.onload = forum.start;


HTMLElement.prototype.has_class = function (c) {
	return this.className.indexOf(c) >= 0;
};