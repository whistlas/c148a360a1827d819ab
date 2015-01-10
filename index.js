//var socket = ;
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = require('socket.io').listen( server );

var clients = {};

io.sockets.on( 'connection', function( socket ) {
	console.log( "New client !" );
	
	socket.on( 'message', function( data ) {
		//console.log( 'Message received ' + data.name + ":" + data.message );
		
		socket.broadcast.emit( 'message', { name: data.name, message: data.message } );
		//io.sockets.emit( 'message', { name: data.name, message: data.message } );
	});
	
	socket.on('registerUser', function(data){
		console.log( 'Registered ' + data.hashCode );
   		clients[data.hashCode] = {
      		"socket": socket.id
    	};
	});
	
	
	socket.on('sendMessage', function(data){
		console.log("Sending: " + data.message + " to " + data.hashCode);
		
		if(clients[data.hashCode]){
		  console.log('directing to ' + clients[data.hashCode].socket);
		  //io.sockets.broadcast.to(clients[data.hashCode].socket).emit("incomingMessage", data);
		  //io.sockets.to(clients[data.hashCode].socket).emit("incomingMessage", data);
		  io.sockets.connected[clients[data.hashCode].socket].emit("incomingMessage", data);
		 // io.sockets.emit("incomingMessage", io.sockets);
		  //io.sockets.emit("incomingMessage", data);
		} else {
		  console.log("User does not exist: " + data.hashCode); 
		}
  	});
	
	//Removing the socket on disconnect
	socket.on('disconnect', function() {
		for(var user in clients) {
			if(clients[user].socket === socket.id) {
				delete clients[user];
				console.log(user + " disconnected");
				break;
			}
		}	
	  })
  
  
  
  
});

server.listen(8080);