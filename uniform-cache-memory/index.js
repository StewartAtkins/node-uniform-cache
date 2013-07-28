var self = {};
module.exports = exports = self;

//TODO: implement garbage collection to reduce memory footprint by not retaining expired items

self.createClient = function(options){
	var ret = {};
	
	var storage = {};
	
	var removeKeyIfExpired = function(key){
		if(key in storage){
			if(storage[key].expireTime != 0 && storage[key].expireTime < new Date().getTime())
				delete storage[key];
		}
	};
	
	ret.fetch = function(key, generator, callback){
		if(!callback){
			callback = generator;
			generator = null;
		}
		removeKeyIfExpired(key);
		
		if(key in storage){
			callback(null, storage[key].data);
		}else{
			if(generator){
				generator(function(err, data, ttl){
					try {
						ttl = parseInt(ttl);
						if(isNaN(ttl))
							ttl = -1;
					}catch(e){}
					var spec = null;
					if(!err){
						spec = data;
						if(typeof(spec) == "undefined")
							spec = null;
						ret.store(key, spec, ttl, true);
					}
					//TODO: should callback wait until store is run, if it runs?
					callback(err, spec);
				});
			}else{
				callback(null, null);
			}
		}
	};
	
	ret.store = function(key, val, ttl, overwrite, callback){
		removeKeyIfExpired(key);
		overwrite = !!overwrite;
		if(!overwrite && key in storage){
			//should the error be null in this case?
			callback(null);
			return;
		}
		if(ttl >= 0){
			storage[key] = {
				"data": val,
				"expireTime": (ttl ? new Date().getTime() + ttl : 0)
			};
		}
		if(callback)
			callback(null);
	};
	
	ret.remove = function(key, callback){
		if(key in storage)
			delete storage[key];
		if(callback)
			callback(null);
	};
	
	ret.increment = function(key, amt, callback){
		amt = amt || 1;
		removeKeyIfExpired(key);
		if(!(key in storage)){
			ret.store(key, 0, 0);
		}
		
		var incrAmt = 0;
		try {
			incrAmt = parseInt(amt);
			if(isNaN(incrAmt))
				incrAmt = 0;
		}catch(e){}
		
		storage[key].data += incrAmt;
		if(callback){
			callback(null, storage[key].data);
		}
	};
	
	ret.close = function(){
		//No Op
	};
	
	return ret;
};
