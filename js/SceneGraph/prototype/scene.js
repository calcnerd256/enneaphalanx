SceneGraph.prototype.scene = function(
    scene,
    ctx,
    left,
    top,
    width,
    height,
    time
){
    return [].concat.apply(
	[],
	scene.map(
	    function(s){
		return s.step(ctx, left, top, width, height, time);
	    }
	)
    );
};
