var redis = require('redis');

var self = {};
module.exports = exports = self;

self.createClient = function(options){
	var ret = {};
	
	var client = redis.createClient(options);
	
	//TODO: handle options
	
	
	ret.fetch = function(key, callback, generator){
		if(!client){
			client = createClient(options);
		}
		
		
		
	};
	
	ret.store = function(key, val, ttl, overwrite, callback){
		overwrite = !!overwrite;
		if(!client){
			client = createClient(options);
		}
		
		
	};
	
	ret.remove = function(key, callback){
		if(!client){
			client = createClient(options);
		}
		
		
	};
	
	ret.increment = function(key, amt, callback){
		amt = amt || 1;
		if(!client){
			client = createClient(options);
		}
		
		
		
	};
	
	ret.close = function(){
		if(client){
			client.quit();
			client = null;
		}
	};
	
	return ret;
};
