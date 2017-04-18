SceneGraph.prototype.Scener = function Scener(transforms, scener){
    this.transforms = transforms;
    this.scener = scener;
    this.args = [].slice.call(arguments, 2);
};
SceneGraph.prototype.Scener.prototype.camera = function(
    ctx,
    left,
    top,
    width,
    height,
    time
){
    return this.transforms.reduce(
	function(cam, transform){
	    return transform.apply(null, cam);
	},
	arguments
    );
};
SceneGraph.prototype.Scener.prototype.precompose = function(transforms){
    var result = Object.create(this);
    result.transforms = transforms.concat(this.transforms);
    return result;
};
SceneGraph.prototype.Scener.prototype.make_scene = SceneGraph.prototype.make_scene;
SceneGraph.prototype.Scener.prototype.step = function(
    ctx,
    left,
    top,
    width,
    height,
    time
){
    var args = this.args.map(function(thunk){return thunk();});
    var cam = this.camera.apply(this, arguments);
    if(cam[3] < 1) return [];
    if(cam[4] < 1) return [];
    var scener = this.scener.apply(null, args);
    var scene = scener.apply(this, cam);
    return this.make_scene.apply(this, [this.transforms].concat(scene));
};

SceneGraph.prototype.Scener.Atomic = function AtomicScener(steps){
    this.steps = steps;
};
SceneGraph.prototype.Scener.Atomic.prototype.constructor = SceneGraph.prototype.Scener.Atomic;
SceneGraph.prototype.Scener.Atomic.prototype.precompose = function precompose(transforms){
    return new (this.constructor)(
	this.steps.map(
	    function(step){
		return step.precompose(
		    transforms
		);
	    }
	)
    );
};
SceneGraph.prototype.Scener.Atomic.prototype.camera = function camera(){
    return [].slice.call(arguments);
};
SceneGraph.prototype.Scener.Atomic.prototype.make_scene = SceneGraph.prototype.Scener.make_scene;
SceneGraph.prototype.Scener.Atomic.prototype.step = function step(){
    var args = arguments;
    var result = [].concat.apply(
	[],
	this.steps.map(
	    function(step){
		return step.step.apply(step, args);
	    }
	)
    );
    if(!result.length) return result;
    return [new (this.constructor)(result)];
};
