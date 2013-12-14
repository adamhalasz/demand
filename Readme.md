# Demand module
Form error handling for `dietjs`

### How it works?
- You can demand `request.body[..]` values to match criterias like existence, length etc.. 
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
You can check if everything is ok with the submitted data with `request.check`:
```javascript
var app = new Application(options);

app.get('/login', function(request, response, mysql){
	// DEMAND values to be specific
	request.demand('username').length(0,40);
	request.demand('email').length(0,40).isEmail();
	request.demand('password').length(0,40).equals(request.body.password_again);
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

Function | Condition | Example | Use Case
--- | --- | --- | ---
`is` | **regex** | `/([0-9]+)/i` | `request.demand('id').is(/([0-9]+)/i)`
`isset` | **defined** | `undefined` vs `hell world` | `request.demand('message').isset()`
`isArray` | **array** | `[1,3,5,7]` | `request.demand('users').isArray()`
`isNumber` | **integer** | `8080` | `request.demand('birth_day').isNumber()`
`isBoolean` | **boolean** | `true` or `false` | `request.demand('agree').isBoolean()`
`isText` | **alpha** | `A simple text` | `request.demand('username').isText()`
`isString` | **string** | `52 people likes you today!` | `request.demand('message').isString()`
`isSlug` | **slug** | `seomthing_like_this_842` | `request.demand('username').isSlug()`
`isEmail` | **email** | `me@email.com` | `request.demand('email').isEmail()`
`isURL` | **url** | `http://example.com/?p=10` | `request.demand('personal_blog').isUrl()`
`length` | **range** | `hello` is `4` | `request.demand('tweet').length(0, 140)`
`equals` | **comparison** | comparing value `a` with `b` | `request.demand('agree').equals('true')`

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