var self = {};
module.exports = exports = self;

self.createClient = function(options){
	var ret = {};
	
	ret.fetch = function(key, generator, callback){
		if(!callback){
			callback = generator;
			generator = null;
		}
		if(generator){
			generator(function(err, data, ttl){
				var spec = null;
				if(!err){
					spec = data;
				}
				callback(err, spec);
			});
		}else{
			callback(null, null);
		}
	};
	
	ret.store = function(key, val, ttl, overwrite, callback){
		if(callback)
			callback(null);
	};
	
	ret.remove = function(key, callback){
		if(callback)
			callback(null);
	};
	
	ret.increment = function(key, amt, callback){
		amt = amt || 1;
		if(callback)
			callback(null, amt);
	};
	
	ret.close = function(){
		//No Op
	};
	
	return ret;
};
