// CHECK module v0.2 alpha
/*
	
	=================[ HOW IT WORKS ]=================
	- The module is included in the App module
	- The module is accessible in every GET/POST request
	- The module can be accessed with request.check function
	- The module accepts unlimited agruments, each argument by right goes deeper in request.body
	- If request.passed is true than the form request has passed
	- If request.passed is false then request.errors contains the errors in JSON
	
	ex: 
	1.	HTTP POST request /login?json={
			'account':{
				username:'adam',
				password:'123456',
			},
			'remain_logged_in': true
		}
	2.	app.get('/login', function(request, response, mysql){
			request.check('account', 'username').length(0,40);
			request.check('account', 'password').length(0,40);
			request.check('remain_logged_in').isBoolean().length(0,1);
			if(request.passed){ 
				... continue ... 
			} else {
				response.end(JSON.stringify(request.errors));
			}
		});
	
	New Middlewares
	================================================================================================
	function							usage											importance
	================================================================================================
	- request.error(field, message)		register an error								(optional)
		- `field`							- field name in request.body 					(required)
		- `message`							- message to send back as error					(required)		
	- response.success(data)			end the request successfully					(optional)
		- `data`							- end request with optional parameters			(optional)
	- response.error(data)				end the request	with errors						(optional)
		- `data` 							- end request with optional parameters			(optional)
	
	
	Check Functions
	================================================================================================
	function		for				notes
	================================================================================================
	- is			regex			match value against a regex
	- isset			not empty
	- isArray		array			[1,3,5,7]	
	- isNumber		integer
	- isBoolean		boolean
	- isText		alpha			A simple text
	- isString		string
	- isSlug 		no whitespace	string_like_this_007
	- isEmail		email			me@email.com
	- isURL			url				http://example.com/?p=10
	- length		range			0,50
	
	=================[ VERSION HISTORY ]=================
	#v0.2 alpha
	- introduced: request.error(field, message) 
	- introduced: response.success(data) 
	- introduced: response.error(data) 
	
	#v0.1.1 alpha
	- Echo added to arguments for multi language `isset checking`
	- Bug Fixes
	
	#v0.1
	- First Release
*/

toSlug = function(string){ return string.replace(/\s/, '_').toLowerCase(); }
toInt = function(string){ return parseInt(string); }
toAlpha = function(string){ return string.replace(/[^a-zA-Z\s\t\r\n]+/gi, ''); }
toAlphaNumeric = function(string){ return string.replace(/[^a-zA-Z0-9\s\t\r\n]+/gi, ''); }
toNumeric = function(string){ return string.replace(/[^0-9\s\t\r\n]+/gi, ''); }
isArray = function(value){ 
	return (typeof value == 'object' && Object.prototype.toString.call(value) == '[object Array]');
}
isObject = function(value){ 
	return (typeof value == 'object' && Object.prototype.toString.call(value) != '[object Array]');
}

module.exports = function(request, response, app){
	var language = (request.cookies && request.cookies.language) || 'English';
	var echo 	 = app.dictionary ? app.dictionary.echo(language) : function(s){ return s; };
		
	request.error = function(field, message){
		request.passed = false;
		request.errors[field] = message;
	}
	
	response.success = function(data){
		var base 		 = { passed: true, errors: false };
		var responseData = (isset(data)) ? merge(base, data) : base ;
		response.end(JSON.stringify(responseData));
	}
	response.error = function(data){
		var base 		 = { passed: false, errors: request.errors };
		var responseData = (isset(data)) ? merge(base, data) : base ;
		response.end(JSON.stringify(responseData));
	}
	
	function checkSetup(){ // <--- arguments come here
		// SETUP variables
		var check 		= {};
		var holder 		= (request.body) ? request.body : request.query ;
		var object 		= ObjectPager(arguments, holder);
		var value   	= object.holder;
		var argument	= echo(object.lastArgument);
		var error 		= new Errors({request:request, arguments:arguments});
		
		if(isset(value)){
			// SETUP check functions
			if(toSlug(argument) == toSlug(value)){
				error('it\'s empty');
			}
		} else {
			error('it\'s empty');
		}
		
		// REGEX
		check.is = function(regex){
			if(isset(value)){
				if(value.search(regex) == -1){ error('is invalid'); }
				return check;
			}
		}
			
		// NOT EMPTY
		check.isset = function(){
			if(isset(value)){
				if(typeof value == object){
					if(objectLength(value) == 0){
						error('is empty');
					}
				} else {
					if(!isset(value)){
						error('is empty');
					}
				}
				return check;
			}
		}
		
		// ARRAY
		check.isArray = function() {
	        if(isset(value) && typeof value != 'object' || Object.prototype.toString.call(str) != '[object Array]'){
	        	error('not array');
	        }
	        return check;
	    }
	    
	    // TEXT
	    check.isText = function(){
	    	if(isset(value) && !value.match(/^[a-zA-Z\s\n\r\t]+$/gi)){ error('not text'); }
	    	return check;
	    };
	    
		// NUMBER
		check.isNumber = function(min, max){
			if(isset(value) && !parseInt(value)){ error('not number'); }
			return check;
		};
		
		// STRING
		check.isBoolean = function(min, max){
			if(isset(value) && typeof value != 'boolean'){ error('not boolean'); }
			return check;
		};
		
		// STRING
		check.isString = function(min, max){
			if(isset(value) && typeof value != 'string'){ error('not string'); }
			return check;
		};
		
		// SLUG
		check.isSlug = function(min, max){
			if(isset(value)){
				if(typeof value == 'string'){
					if(value.search(/\s|\n|\r/gi) != -1){
						error('not slug');
					}
				} else{
					error('not slug');
				}
			}
			return check;
		};
		
		// EMAIL
		check.isEmail = function(){
			if(isset(value)){
				var match = value.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
				if(!match){ error('not email'); }
			}
			return check;
		};
		
		// URL
		check.isURL = function(){
			if(isset(value)){
				var uri = url.parse(value);
				if(!uri.protocol || !uri.hostname){
					error('is invalid');
				}
			}
			return check;
		}
		
		// LENGTH
		check.length = function(min, max){
			if(isset(value)){
				if(isset(min)){
					if(value.length <= min) {
						error('too short');
					}
				} 
				if(isset(max)){
					if(value.length >= max) {
						error('too long');
					}
				}
			}
			return check;
		};
		
		// EQUALS
		check.equals = function(match){
			if(isset(value) && value != match){ error('not equals'); }
			return check;
		};
		
		// FOOTER
		return check;
	}
	
	// RETURN module function
	return checkSetup;
}

// ====================== CHECK ADDONS ======================

// ObjectPager Function
// This function gets the last value from the request.body by arguments
// ex: - WHERE request.body = { details: { username: 'adam' } }
//	   - CALL request.check('details', 'username').isNumber()
function ObjectPager(args, valueHolder){
	var holder = hook(valueHolder, {});
	for(index in args){
		var argument = args[index];
		holder = holder[argument];
	}
	return {holder: holder, lastArgument: argument };
}

// Error function
function Errors(options){

	// This function is called for every field which has an error
	return function(message){
		// REQUEST has not passed
		options.request.passed = false;
		
		// GET errors holder
		var holder = options.request.errors;
		
		// FOREACH arguments
		for(index in options.arguments){
			// CONSTURCT variables
			var argument = options.arguments[index];
			var max 	 = objectLength(options.arguments);
			var current  = parseInt(index)+1;
			
			// On end of the loop assign the message to the error field
			if(current == max){
				holder[argument] = capitalize(message);
				
			// On middle or start of the loop create the error field holder
			// this is used for multi dimensional objects like 
			// ex: { details: { weight: '60kg' } }
			} else {
				if(!holder[argument]) holder[argument] = {};
				holder = holder[argument];
				
			}
		}
	}
}
