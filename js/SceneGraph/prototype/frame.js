SceneGraph.prototype.frame = function frame(t, state){
    var canv = this.dom.canvas();
    var delta_time = 0;
    if("last_time" in this)
	delta_time = t - this.last_time;
    this.last_time = t;
    var w = canv.width;
    var h = canv.height;
    var ctx = canv.getContext("2d");
    var time = [t, delta_time];
    var start = +new Date();
    var scene = this.backlog[0].concat(
	state.parent.scene.fractal(this, state)
    );
    scene = this.scene(scene, ctx, 0, 0, w, h, time);
    if(!this.backlog[1].length)
	this.backlog[1] = scene;
    this.backlog[0] = [];
    var level = window.applications.util["low bit"](this.frame_number++);
    while(+new Date() - start < 12)
	level = this.step(level, ctx, w, h, time);
    return this.next_frame().then(
	(
	    function(t){
		return this.frame(t, state);
	    }
	).bind(this)
    );
};
