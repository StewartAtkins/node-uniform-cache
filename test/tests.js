var impls = ["dummy","memory","redis"];

for(var k in impls){
	createTests(impls[k]);
}

var timestamp = new Date().getTime();

function createTests(impl){
	var module = require("../uniform-cache-"+impl);
	
	/* The arguments provided here should cover all implementation cases */
	
	var client = module.createClient({
		"redis": {
			"host": "127.0.0.1",
			"port": "6379",
		},
	});
	
	/* This test verifies that fetching an empty key returns a null value */
	exports["EmptyFetch-"+impl] = function(test){
		test.expect(2);
		client.fetch("__test__emptyfetch__"+timestamp,function(err, data){
			test.equal(err, null, "Fetch returned error");
			test.equal(data, null, "Fetch returned unexpected data");
			test.done();
		});
	};
	
	/* This test verifies that storing a key then fetching it returns the correct value */
	exports["DataFetchAndStore-"+impl] = function(test){
	
		test.expect(3);
		var insdata = "hello";
		var keyname = "__test__datafetch__"+timestamp;
		
		client.store(keyname,insdata,0,true,function(err){
			test.equal(err, null, "Store returned error");
			client.fetch(keyname,function(err, data){
				test.equal(err, null, "Fetch returned error");
				test.equal(data, (impl == "dummy"?null:insdata), "Fetch returned incorrect data");
				test.done();
			});
		});
	};
	
	/* As above, but verifies that deleting the key then returns a null value */
	exports["DataFetchAndStoreAndDelete-"+impl] = function(test){
	
		test.expect(6);
		var insdata = "hello";
		var keyname = "__test__datafetch__"+timestamp;
		
		client.store(keyname,insdata,0,true,function(err){
			test.equal(err, null, "Store returned error");
			client.fetch(keyname,function(err, data){
				test.equal(err, null, "Fetch returned error");
				test.equal(data, (impl == "dummy" ? null : insdata), "Fetch returned incorrect data");
				client.remove(keyname,function(err){
					test.equal(err, null, "Remove returned error");
					client.fetch(keyname, function(err, data){
						test.equal(err, null, "Fetch 2 returned error");
						test.equal(data, null, "Fetch 2 returned unexpected data");
						test.done();
					});
				});
			});
		});
	};
	
	/* This test verifies that a store instruction with a TTL expires correctly */
	/* Due to the nature of this test, it takes approximately 1.5 seconds to run per implementation */
	exports["StoreWithTTL-"+impl] = function(test){
		test.expect(5);
		
		var insdata = "hello";
		var keyname = "__test__datafetch__"+timestamp;
		
		var deleteTime = 1000;
		client.store(keyname,insdata,deleteTime,true,function(err){
			test.equal(err, null, "Store returned error");
		});
		setTimeout(function(){
			client.fetch(keyname, function(err, data){
				test.equal(err, null, "Fetch 1 returned error");
				test.equal(data, (impl == "dummy" ? null : insdata), "Fetch 1 returned incorrect data");
			});
		}, 500);
		setTimeout(function(){
			client.fetch(keyname, function(err, data){
				test.equal(err, null, "Fetch 2 returned error");
				test.equal(data, null, "Fetch 2 returned unexpected data");
				test.done();
			});
		}, 1500);
	};
	
	/* This test verifies that fetching a non-existant key will utilise a generator and store the data */
	exports["EmptyFetchWithGenerator-"+impl] = function(test){
		test.expect(4);
		var testdata = "hi there";
		var keyname = "__test__generateddata__"+timestamp;
		client.fetch(keyname,function(callback){
			callback(null, testdata, 0);
		},function(err, data){
			test.equal(err, null, "Fetch 1 returned error");
			test.equal(data, testdata, "Fetch 1 returned incorrect data");
			client.fetch(keyname, function(err, data){
				test.equal(err, null, "Fetch 2 returned error");
				test.equal(data, (impl == "dummy" ? null : testdata), "Fetch 2 returned incorrect data");
				test.done();
			});
		});
	};
	
	/* This test verifies that a generator which returns an error does not result in data being stored */
	exports["EmptyFetchWithGeneratorError-"+impl] = function(test){
		test.expect(2);
		var testdata = "hi there";
		var keyname = "__test__generateddata2__"+timestamp;
		var eerr = "Something happened";
		client.fetch(keyname,function(callback){
			callback(eerr,null);
		},function(err, data){
			test.equal(err, eerr, "Fetch returned error");
			test.equal(data, null, "Fetch returned unexpected data");
			test.done();
		});
	};
	
	/* This test verifies the behaviour of the increment command */
	exports["Increment-"+impl] = function(test){
		test.expect(4);
		var keyname = "__test__increment__"+timestamp;
		client.increment(keyname, 2, function(err, data){
			test.equal(err, null, "Increment 1 returned error");
			test.equal(data, 2, "Increment 1 returned incorrect data");
			client.increment(keyname, 1, function(err, data){
				test.equal(err, null, "Increment 2 returned error");
				test.equal(data, (impl == 'dummy' ? 1 : 3), "Increment 2 returned incorrect data");
				test.done();
			});
		});
	};
	
	/* This test verifies that two store operations on the same key */
	/*  return the second value if the second store is set to overwrite */
	exports["OverwiteEnabledStore-"+impl] = function(test){
		test.expect(6);
		var keyname = "__test__overwiteenabled__"+timestamp;
		var insdata1 = "data1";
		var insdata2 = "woo";
		client.store(keyname,insdata1,0,true,function(err){
			test.equal(err, null, "Store 1 returned error");
			client.fetch(keyname,function(err, data){
				test.equal(err, null, "Fetch 1 returned error");
				test.equal(data, (impl == "dummy" ? null : insdata1), "Fetch 1 returned incorrect data");
				client.store(keyname,insdata2,0,true,function(err){
					test.equal(err, null, "Store 2 returned error");
					client.fetch(keyname,function(err,data){
						test.equal(err, null, "Fetch 2 returned error");
						test.equal(data, (impl == "dummy" ? null : insdata2), "Fetch 2 returned incorrect data");
						test.done();
					});
				});
			});
		});
	};
	
	/* This test verifies that two store operations on the same key */
	/*  return the first value if the second store is set to not overwrite */
	exports["OverwiteDisabledStore-"+impl] = function(test){
		test.expect(6);
		var keyname = "__test__overwitedisabled__"+timestamp;
		var insdata1 = "data1";
		var insdata2 = "woo";
		client.store(keyname,insdata1,0,true,function(err){
			test.equal(err, null, "Store 1 returned error");
			client.fetch(keyname,function(err, data){
				test.equal(err, null, "Fetch 1 returned error");
				test.equal(data, (impl == "dummy" ? null : insdata1), "Fetch 1 returned incorrect data");
				client.store(keyname,insdata2,0,false,function(err){
					test.equal(err, null, "Store 2 returned error");
					client.fetch(keyname,function(err,data){
						test.equal(err, null, "Fetch 2 returned error");
						test.equal(data, (impl == "dummy" ? null : insdata1), "Fetch 2 returned incorrect data");
						test.done();
					});
				});
			});
		});
	};
	
	//Other possible tests:
	//Generator that returns data as well as error?
	//Generator that returns TTL?
	
	
	/* This test can never fail, it executes to clean up each implementation's client */
	/* IT SHOULD ALWAYS BE RUN LAST (Implementation specific tests should construct their own)*/
	exports["Close-"+impl] = function(test){
		client.close();
		test.expect(0);
		test.done();
	};
}



/*
* Implementation-specific tests
*/

/* This test verifies that the redis implementation can utilise separate databases */
/*  by storing to one and trying to read from another. If the test fails then the read */
/*  operation will return the stored data by reading from the same database */
exports["RedisDatabaseSelect"] = function(test){
	var module = require("../uniform-cache-redis");
	var client = module.createClient({
		"redis": {
			"host": "127.0.0.1",
			"port": "6379",
			"db": 11,
		},
	});
	var client2 = module.createClient({
		"redis": {
			"host": "127.0.0.1",
			"port": "6379",
			"db": 12,
		},
	});
	test.expect(3);
	var insdata = "hello";
	var keyname = "__test__database__"+timestamp;
	
	client.store(keyname,insdata,0,true,function(err){
		test.equal(err, null, "Store returned error");
		client2.fetch(keyname,function(err, data){
			test.equal(err, null, "Fetch returned error");
			test.equal(data, null, "Fetch returned unexpected data");
			client.close();
			client2.close();
			test.done();
		});
	});
};