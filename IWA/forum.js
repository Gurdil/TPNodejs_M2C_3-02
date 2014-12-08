var forum ={};

forum.start = function ()
{
	forum.get_thread();
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

	elt.innerHTML += separ + "<div class=\"row message\">"
	+ "<p>" + a + "<p>" + "</div>";
};

/*
forum.get_threads = function ()
{

	var array= [];

	$.getJSON("http://tp-iwa.waxo.org/get_threads", function(data) 
	{

	//alert("Data" + data);
	
	array=data.threads;

	alert("Data" + array)
	
	});

	
};*/


forum.cb_get = function () 
{
	var data=[];
    if (this.readyState == 4 && this.status == 200) 
	{	
		data= JSON.parse(this.responseText).threads;
		forum.show_thread(data);
    }
};


forum.cb_show = function ()
{
	var data=[];
    if (this.readyState == 4 && this.status == 200) 
	{	
		data= JSON.parse(this.responseText).thread;
		//alert("data" +data.length);
		forum.show_content(data);
    }
};


forum.get = function (req, cb)
{
	//on crée une variable au format XMLhttp
	var xhr = new XMLHttpRequest();
	//on ouvre l URL ,la requet est de facon asynchrone 
    xhr.open("GET", req, true);
	//quand l ouverture et prete on change la valeur par cb
    xhr.onreadystatechange = cb;
	//on envoi la toute la donner avec le changement 
    xhr.send();
}


forum.get_thread = function ()
{  
	var req="http://tp-iwa.waxo.org/get_threads";
	forum.get(req,forum.cb_get);
};


forum.show_thread = function (data)
{  
	var threadArray=[];
	var thread= [];

	//threadArray=iwa.get_thread();
	threadArray=data;

	//alert("thread lenght" +threadArray.length);


	for(var i=0; i<11; ++i)
	{

		thread.push(threadArray[threadArray.length-i-1]);
	}

	alert("11 last threads  " + thread);

	var div = document.getElementById("discussions");

	for(i in thread)
	{

		div.innerHTML += '<tr><td><a id=' + thread[i] + ' href="thread.html?id=' + thread[i] + '"><div>' + thread[i] + '</div></a></td><td><span class="badge">' + i + '</span></td><td></tr>';
    	//compteur++;
		
	}
};


var compteur=0;
forum.show_content = function (data)
{  
	var threadArray=[];

	threadArray=data;

	
	var div = document.getElementById("discussions");
    var html = "";

    for (var i=0; i<threadArray.length; ++i) {

    	div.innerHTML += '<tr><td>'+ '<span class="badge">' + compteur + '</span>' +'</td><td>'+ threadArray[i]+'</td></tr>'
    	compteur++;
       	
    }

};


window.onload = forum.start;


HTMLElement.prototype.has_class = function (c)
{
	return this.className.indexOf(c) >= 0;
};