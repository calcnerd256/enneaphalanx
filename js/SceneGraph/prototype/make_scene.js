SceneGraph.prototype.make_scene = function(transforms){
    return [].slice.call(arguments, 1).map(
	function(step){
	    return step.precompose(transforms);
	}
    );
};
