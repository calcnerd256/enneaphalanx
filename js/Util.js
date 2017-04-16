function Util(){
    this.cond = function dispatch_switch(args){
	for(var i = 0; i < args.length; i++)
	    if(args[i][0]())
		return args[i][1]();
    };
    this["bind from"] = function curriedBindFrom(ob){
	return function(key){
	    return ob[key].bind(ob);
	};
    };
    this.identity = function I(x){return x;};
    this.K = function K(x){
	function konstant(){
	    return x;
	}
	konstant.x = x;
	return konstant;
    };
    this.associate = function associate(xs){
	var result = window.applications.util.identity;
	xs.map(function(x){result = result(x);});
	return result;
    };
    this.easier_lookup = function(key){
	var static = {
	    "bind from": window.applications.util["bind from"],
	    "cond": window.applications.util.cond,
	    "K": window.applications.util.K
	};
	if(key in static)
	    return static[key];
    };
    this["low bit"] = function(num){
	var result = 0;
	while(!(num & 1)){
	    result++;
	    num >>= 1;
	}
	return result;
    }
}
