node-uniform-cache
==================

Uniform Cache is a collection of modules which present an identical or uniform interface to various caching mechanisms.

The interface provided is relatively basic to ensure portability between backing stores, but also provides a basic read-through mechanism.

The available backing stores are:
* Dummy - no backing store, will return data if used with the read-through mechanism or increment command, but otherwise returns null.
* Memory - basic in-memory backing store, keeps data in process memory which is not persistent but likely acceptable if a standalone backing store is not available or not desired.
* Redis - uses a redis server as a backing store
* Memcache - Not yet implemented

###Why was it created?
This project was created to provide a simple interface to an application requiring caching, while allowing flexibility in the underlying data store used.
The libraries were designed to allow an application to switch which store is used simply by changing the name of the require'd module. So a project can use a redis store in production but a dummy or in-memory store during development where you don't need a redis instance.

###Usage
Please refer to the individual module readme files for details on any module-specific configuration such as connection parameters. 
Where such parameters are present the modules aim to maintain separation between the arguments so that one configuration can provide settings for multiple modules and the right module will select it's settings and ignore the rest.

####Interface
As you probably know JavaScript doesn't support interfaces, but if it did, it'd look like this:
```JavaScript
module.createClient(options) - returns Cache instance, see individual modules for options

Cache.fetch(key, callback, generator = null) - callback(err, data), generator(callback)* (optional)
Cache.store(key, val, ttl, overwrite = false, callback = null) - overwrite (optional, default: false), callback(err, data) (optional). TTL measured in milliseconds
Cache.remove(key, callback = null) - callback(err, data) (optional)
Cache.increment(key, amount = 1, callback = null) - amount (optional, default: 1), callback(err, data) (optional)
Cache.close() - disconnects the cache instance from the network (if applicable)
```

* The generator is passed a callback which it is expected to use to pass the data back. The data will be stored in the cache then returned to the original caller's callback.
The callback has the signature callback(err, data, ttl = 0) where err is passed back to the original caller's callback. Note: data is only returned and stored if no error occurred.

####Usage example
Here's a simple example, express is not required, but is used here to demonstrate a simple use case.
```JavaScript
var module = require('../uniform-cache-dummy');
var options = {...};
var client = createClient(options);

var app = require('express')();
...

app.get("/",function(request, response){
	client.fetch("articlelist", function(err, articledata){
		response.render("template",articledata);
	},function(callback){
		db.query("...",function(rows){
			//send the result back and store it in the cache for 1 hour
			callback(null, rows, 60 * 60 * 1000);
		});
	});
});

app.listen(3000);
```

###Tests
Tests - we have some. Run with Nodeunit.

###npm
These packages (excluding the tests) are available through npm, search for uniform cache.