var impls = ["dummy","memory"/*,"redis"*/];

for(var k in impls){
	createTests(impls[k]);
}

function createTests(impl){
	var module = require("../uniform-cache-"+impl);
	var client = module.createClient();
	var timestamp = new Date().getTime();
	exports["EmptyFetch-"+impl] = function(test){
		test.expect(2);
		client.fetch("__test__emptyfetch__"+timestamp,function(err, data){
			test.equal(err, null, "Fetch returned error");
			test.equal(data, null, "Fetch returned unexpected data");
			test.done();
		});
	};
	
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
			});
			test.done();
		}, 1500);
	};
	
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
			});
		});
		test.done();
	};
	
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
		});
		test.done();
	};
	
	
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
	
	//Other possible tests:
	//Generator that returns data as well as error?
	//Generator that returns TTL?
}