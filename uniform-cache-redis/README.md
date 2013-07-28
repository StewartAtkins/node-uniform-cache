node-uniform-cache Redis implementation
=======================================

Uniform Cache is a collection of modules which present an identical or uniform interface to various caching mechanisms.

The interface provided is relatively basic to ensure portability between backing stores, but also provides a basic read-through mechanism.

This implementation uses a redis server as a backing store, the persistence of cached data is therefore dictated by redis.

More details are available through the separate README file in the root of the repository on GitHub.

###Module-specifics
This module requires at least some arguments. All the arguments for this module are contained in a 'redis' object inside the options.
* host - hostname or IP address for the redis server (required)
* port - port to connect to on the redis server (required)
* password - password to use to authenticate against the redis server (optional - default: "")
* db - database ID to use in redis (optional, default: the default database)
```JavaScript
var options = {
	redis: {
		host: "127.0.0.1",
		port: 6379,
		password: "moo",
		db: 9,
	},
};
```