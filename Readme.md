# Demand module
Form error handling for `dietjs`

### How it works?
- You can demand `request.body[..]` values to match criterias like existence, length etc.. 
- The module is included in the App module
- The module is accessible in every `POST` request
- The module can be accessed with the `request.demand` function
- The module accepts unlimited agruments, each argument by right goes deeper in `request.body`
- If `request.passed` is true than the form request has passed
- If `request.passed` is false then `request.errors` contains the errors in JSON
- You can answer if 
	- `request.passed` with `response.success(data)`
	- else with `response.error(data)` 
	- *data* is optional

### Example
When a `POST` request comes in (from a form or ajax request) with these parameters:
```javascript
	{
		'account':{
			username:'adam',
			password:'123456',
		},
		'remain_logged_in': true
	}
```
You can check is everything is ok with the submitted data with `request.check`:
```javascript
var app = new Application(options);

app.get('/login', function(request, response, mysql){
	// DEMAND values to be specific
	request.demand('username').length(0,40);
	request.demand('email').length(0,40).isEmail();
	request.demand('password').length(0,40).is(request.body.password_again);
	request.demand('options', 'remain_logged_in').isBoolean().length(0,1);
	
	// IF request has passed 
	if(request.passed){ 
		response.success(); // { passed: true, errors: false}
		mysql.end();
	} else {
		response.error(); // { passed: true, errors: [{..},{..}]}
		mysql.end();
	}
});
```

### Demand Functions
- **is**			
	- for: regex			
	- notes: match value against a regex
	
- **isset**		
	- for: `not empty`
	- example: `[1,3,5,7]`
	
- **isArray**			
	- for: `array`	
		
- **isNumber**		
	- for: `integer`
	
- **isBoolean**		
	- for: `boolean`
	
- **isText**		
	- for: `alpha`			
	- notes: `A simple text`
	
- **isString**		
	- for: `string`
	
- **isSlug** 		
	- for: `no whitespace`	
	- example: `string_like_this_007`
	
- **isEmail**		
	- for: `email`		
	- example: `me@email.com`
	
- **isURL**			
	- for: `url`				
	- example: `http://example.com/?p=10`
	
- **length**		
	- for: `rang`			
	- example: `0,50`

### Register Errors
- `request.error(field, message)` - both attributes are `required`

### Respond with JSON
- `response.success(data)` 
	- the default response value is `{ passed: true, errors: false}`
  	- `data` is appended to the default json response but it's `optional`
- `response.error(data)` 
	- the default response value is `{ passed: false, errors: [...]}`
  	- `data` is appended to the default json response but it's `optional`
  	- `errors` contain a list of erros with
  	

### Version History
#### v0.2
- `added`: request.error(field, message) 
- `added`: response.success(data) 
- `added`: response.error(data) 

#### v0.1.5 
- `added` Echo to arguments for multi language `isset demading`
- Several Bug Fixes

#### v0.1
- First Release