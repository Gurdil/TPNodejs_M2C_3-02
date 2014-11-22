var net = require('net');
var clients = [];



var server = net.createServer(function(socket) {
  	console.log('server connected');


  	socket.on('end', function() {
    		console.log('server disconnected');
  	});
	socket.name = socket.remoteAddress+":"+socket.remotePort;
  	//socket.write('hello\r\n');
  //	socket.pipe(socket);
	clients.push(socket);

	socket.on('data',function(data){
		console.log(socket.name+data);
		broadcast(data,socket);
	})

	function broadcast(message,sender){
		for( a in clients){
			if(a!=sender){
				clients[a].write(message);
			}
		}
	}
});

server.listen(8124, function() { //'listening' listener
  	console.log('server bound');
});