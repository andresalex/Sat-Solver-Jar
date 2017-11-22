var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var exec = require('child_process').exec, child;

app.get('/', function(req, res){
res.sendFile(__dirname + '/frontend/index.html');
});

http.listen(port, function(){
  console.log("Server started and listen to http://127.0.0.1:" + port);
});



// Trigger bei der Anmeldung 
io.on('connection', function(socket){
  console.log('a user connected');

  // Trigger von Funktion "auswerten"
  socket.on('auswerten', function(msg){
	// Alle Leerzeichen löschen
	msg = msg.replace(/\s/g,'');
	// Ausgabe in Konsole
	console.log('auswerten: ' + msg);
	// Hier wird die jar-Datei sat_solver_demo ausgeführt
	child = exec('java -jar backend/sat_solver_demo.jar 1 ' + msg,
	  function (error, stdout, stderr){
		console.log(stdout);
		//Antwort
		io.emit('antwort_auswerten', stdout);
	});
	//
  });
  
  // Trigger von Funktion "in_knf"
  socket.on('in knf', function(msg){
	// Alle Leerzeichen löschen
	msg = msg.replace(/\s/g,'');
	// Ausgabe in Konsole
	console.log('in knf: ' + msg);
	// Hier wird die jar-Datei sat_solver_demo ausgeführt
	child = exec('java -jar backend/sat_solver_demo.jar 0 ' + msg,
	  function (error, stdout, stderr){
		console.log(stdout);
		//Antwort
		io.emit('antwort_auswerten', stdout);
	});
  });
  
  // Meldung bei Disonnect
  socket.on('disconnect', function(){
	console.log('a user disconnected');
  });
});


