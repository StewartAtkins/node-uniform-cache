var redis = require('redis');

var self = {};
module.exports = exports = self;

self.createClient = function(options){
	var ret = {};
	
	var client = null;
	var createClient = function(){
		if(client){
			return;
		}
		client = redis.createClient(options.redis.port, options.redis.host);
		if("password" in options.redis && options.redis.password){
			client.auth(options.redis.password);
		}
		if("db" in options.redis){
			client.select(options.redis.db);
		}
	}
	
	ret.fetch = function(key, generator, callback){
		if(!callback){
			callback = generator;
			generator = null;
		}
		createClient();
		
		client.get(key, function(err, data){
			if(err || data !== null){
				callback(err, data);
			}else{
				if(generator){
					generator(function(err, data, ttl){
						try {
							ttl = parseInt(ttl);
							if(isNaN(ttl))
								ttl = -1;
						}catch(e){}
						var spec = null;
						if(err){
							callback(err, spec);
						}else{
							spec = data;
							if(typeof(spec) == "undefined")
								spec = null;
							ret.store(key, spec, ttl, true, function(err){
								callback(err, spec);
							});
						}
					});
				}else{
					callback(null, null);
				}
			}
		});
		
	};
	
	ret.store = function(key, val, ttl, overwrite, callback){
		overwrite = !!overwrite;
		createClient();
		
		if(ttl >= 0){
			var args = [key, val];
			if(ttl > 0){
				args.push("PX", ttl);
			}
			if(!overwrite){
				args.push("NX");
			}
			args.push(function(err){
				callback(err);
			});
			client.set.apply(client, args);
		}else{
			callback(null);
		}
	};
	
	ret.remove = function(key, callback){
		createClient();
		
		client.del(key, callback);
	};
	
	ret.increment = function(key, amt, callback){
		amt = amt || 1;
		createClient();
		
		client.incrby(key, amt, callback);
	};
	
	ret.close = function(){
		if(client){
			client.quit();
			client = null;
		}
	};
	
	return ret;
};
