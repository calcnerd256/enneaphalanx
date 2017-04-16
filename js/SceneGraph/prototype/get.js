SceneGraph.prototype.get = function get(key){
    var parent = this;
    if("get" == key)
	return function(k){
	    if("config" == k)
		return parent.dom.config;
	};
};
