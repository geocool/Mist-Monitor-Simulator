#! /usr/local/bin/node

var ResponseData = require('./ResponseData');
var server = require('./Server');

/*
*	Length: x - IMPORTANT
*
*	Metric: 
*			General
*			Load
*			Network
*
*	MinValue: number
*	MaxValue: number
*	floatPrecision: number
*   offset: +-number (less or more data)
*	
*
*
*/
var log = function(message){

	if(message)
		console.log( (new Date()).toLocaleString() + " :: " + message  );
	else
		console.log();
}


var Mode = {
	normal       :  1,
	randomNull   :  2,
	moreValues   :  4,
	lessValues   :  8,
	noValues     : 16,
	delaySend    : 32,
	noZeroLength : 64
}


var produceData = function(options){ // (metric,length,offset){

  	var length   = options['length'];
  	var mode     = options['mode'] ? options['mode'] : 0
  	var metric   = (options['metric'] ? options['metric'] : 'general').toLowerCase();
  	var minValue = options['minValue'] ? options['minValue'] : 0;
  	var floatPrecision = options['floatPrecision'] ? options['floatPrecision'] : null;
  	var noZeroLength = options['noZeroLength'];
  	//var offset   = 
  	//var maxValue =  

  	var producedData = [];
  	var backupValue  = null;

  	switch(metric){
  		case 'general': 


  			for(var i=0; i < length; i++){
  				var value = (Math.random()*100)+minValue;

  				// TODO implement max Value
  				if(floatPrecision)
  					value = +value.toFixed(floatPrecision);

  				producedData.push(value);
  			}

  			break;
  		case 'load':
  			// Todo implement it
  			break;
  		case 'memory':
  			// Todo implement a static line
  			break;
  	}

  	// Do staff based on mode

  	if(mode & Mode.noValues){
  		producedData = [];
  	}

  	if(mode & Mode.lessValues){
  		if( (producedData.length == 1 && !(mode & Mode.noZeroLength) ) || producedData.length > 1 )
  			producedData.pop();
  	}

  	if(mode & Mode.moreValues){
  		producedData.push(producedData[0]);
  	}

  	if(mode & Mode.randomNull){
  		// Be carefull here for max value option TODO
  		var allign = mode & Mode.lessValues ? -1 : 0;

  		var nullIndex = Math.floor(Math.random()*(length+allign) );
  		producedData[nullIndex] = null;
  	}

  	if(mode & Mode.delaySend){
  		// TODO implement it
  	}


  	if(producedData.length == 0 && (mode & Mode.noZeroLength) ){
  		producedData.push(0);
  	}

  	return producedData;
};

var dataResponse = function(data){
	// Calculate Time Window And Number of object we will return

	var start = data['start'];
	var stop  = data['stop'];
	var step  = data['step'];

	var timeRequested  = stop - start;
	var measurements  = timeRequested / (step / 1000); 

	log("Data Request Information")
	log("Time requested in seconds: " + timeRequested);
	log("Time requested in minutes: " + timeRequested/60);
	log("Number of measurements expected: " + measurements);
	log();


	//convert raw data to mist format
	var m_response = new ResponseData();

	var general_options = {
		length: measurements,
		noZeroLength : true
	}

	m_response.load                         = produceData(general_options);
	m_response.memory                       = produceData(general_options);
	m_response.disk.read.xvda1.disk_octets  = produceData(general_options);
	m_response.disk.write.xvda1.disk_octets = produceData(general_options);
	m_response.network.eth0.rx              = produceData(general_options);
	m_response.network.eth0.tx              = produceData(general_options);
	//m_response.cpu.cores                    = 1
	m_response.cpu.utilization              = produceData(general_options);



	return JSON.stringify(m_response);
}


server.setResponse(dataResponse);
server.run();