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
	- `request.passed` with `request.success(objectResponse)`
	- else `request.passed` with `request.error(objectResponse)` 
	- *objectResponse* is optional

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
	request.demand('account', 'username').length(0,40);
	request.demand('account', 'password').length(0,40);
	request.demand('remain_logged_in').isBoolean().length(0,1);
	if(request.passed){ 
		response.success();
	} else {
		response.error();
	}
});
```

### Check Functions
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

### Version History

#### v0.1.1 
- Echo added to arguments for multi language `isset checking`
- Bug Fixes

#### v0.1
- First Release