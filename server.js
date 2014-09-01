var fs = require('fs') ,http = require('http'), socketio = require('socket.io'),
url = require("url")

var five = require("johnny-five"),  board;

board = new five.Board({
  port: "COM14"
});		//load COM port

var val = 0;

var socketServer;
var portName = 'COM14'; //change this to your Arduino port
var sendData = "";




// handle contains locations to browse to (vote and poll); pathnames.
function startServer(route,handle,debug)
{
	// on request event
	function onRequest(request, response) {
	  // parse the requested url into pathname. pathname will be compared
	  // in route.js to handle (var content), if it matches the a page will 
	  // come up. Otherwise a 404 will be given. 
	  var pathname = url.parse(request.url).pathname; 
	  console.log("Request for " + pathname + " received");
	  var content = route(handle,pathname,response,request,debug);
	}
	
	var httpServer = http.createServer(onRequest).listen(1337, function(){
		console.log("Listening at: http://localhost:1337");
		console.log("Server is up");
	}); 
	initSocketIO(httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);
	if(debug == false){
		socketServer.set('log level', 1); // socket IO debug off
	}
	socketServer.on('connection', function (socket) {
	console.log("user connected");
	socket.emit('onconnection', {pollOneValue:sendData});
	socketServer.on('update', function(data) {
	socket.emit('updateData',{pollOneValue:data});
	});
	socket.on('buttonval', function(data) {
		//board.digitalWrite(13, (val = val ? 0 : 1));
		led = new five.Led(11);
  		led.fadeIn();
  		//led.brightness(25)

	});
	socket.on('sliderval', function(data) {
		//serialPort.write(data + 'P');
	});
	
    });
}



exports.start = startServer;