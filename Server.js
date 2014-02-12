/*
	Server Module
*/

var http = require('http');
var url  = require('url');
var qs   = require('querystring');

module.exports = new function(){
	
	var responseCallback;

	// It should have one argument which is object
	this.setResponse = function(callback){
		responseCallback = callback;
	}

	this.run = function(port){

		if(typeof port === 'undefined')
			port = 8182;

		http.createServer(function (request, response) {

		  if(request.method =='GET'){

		  	    console.log("New connection [" + request.connection.remoteAddress + "]");

		  	    // Parse GET data
		  	    var url_parts = url.parse(request.url,true);
		  	    var data = url_parts.query;

		  	    if(data.start && data.stop && data.step){

		  	    	// Fix for SOP(same origin policy)
		  	    	response.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'X-Requested-With'});
		  	    	response.end(responseCallback({
		  	    		start: data.start,
		  	    		stop : data.stop,
		  	    		step : data.step
		  	    	}));

		  	    } 
		  	    else {
		  	    	console.log("Error, some of post data are missing [start,stop,step]")
		  	    }
		  }
		}).listen(port);

		console.log('Server running at http://127.0.0.1:' + port + '/');
	}
	
}
