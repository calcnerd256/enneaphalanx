SceneGraph.prototype.next_frame = function promiseNextFrame(){
    return new Promise(
	function(res, rej){
	    window.requestAnimationFrame(res);
	}
    );
};
