Enneaphalanx.prototype.scene = {
    main: function main(ctx, left, top, width, height, time){
	var w = width / 3;
	return [ctx, left, top, width, height - w, time];
    },
    bottom: function bottom(ctx, left, top, width, height, time){
	var w = width / 3;
	return [ctx, left, top + height - w, width, w, time];
    },
    column: function column(num, den){
	return function(ctx, left, top, width, height, time){
	    var w = width / den;
	    var x = left + w * num;
	    return [ctx, x, top, w, height, time];
	};
    },
    quadrant: function(n){
	n--;
	n %= 4;
	n += 4;
	n %= 4;
	return function(ctx, left, top, width, height, time){
	    var w = width / 2;
	    var h = height / 2;
	    var l = left;
	    if(!n) l += w;
	    if(3 == n) l += w;
	    var t = top;
	    if(n > 1) t += h;
	    return [ctx, l, t, w, h, time];
	};
    },
    clear: function clear(ctx, left, top, width, height, time){
	ctx.clearRect(left, top, width, height);
	return [];
    },
    outline: function outline(ctx, left, top, width, height){
	ctx.strokeStyle = "black";
	ctx.strokeRect(left, top, width, height);
	return [];
    },
    Recur: function(i, state, that, sceneGraph){
	var col = i > 4 ? 2 : 0;
	if(4 == i) col = 1;
	var xforms = [that.bottom, that.column(col, 3)];
	if(1 != col)
	    xforms.push(
		that.quadrant(
		    [2,1,3,4][
			-5 * +(i > 4) + i
		    ]
		)
	    );

	this.transforms = xforms;
	var scene = that;
	this.scener = function recur(){
	    return function(ctx, left, top, width, height, time){
		var s = Object.create(scene.parent.state);
		s.state = state.transition(i);
		return scene.fractal(sceneGraph, s);
	    };
	};
	this.args = [];
	this.hint = ["Recur", i, state];
    },
    fractal: function(sceneGraph, state){
	var get = this.parent.get("get");
	var K = get("K");
	var Scener = sceneGraph.Scener;
	var Recur = this.Recur;
	var stateScene = state.scene(sceneGraph);
	return sceneGraph.make_scene.apply(
	    null,
	    [
		[],
		new Scener([this.main], K(this.clear)),
		new Scener([this.main], K(this.outline))
	    ].concat(
		sceneGraph.make_scene.apply(
		    null,
		    [
			[this.main]
		    ].concat(stateScene)
		),
		[0,1,2,3,4,5,6,7,8].map(
		    (
			function(that){
			    return function(i){
				return new Recur(i, state, that, sceneGraph);
			    };
			}
		    )(this)
		)
	    )
	);
    }
};
Enneaphalanx.prototype.scene.Recur.prototype.camera = SceneGraph.prototype.Scener.prototype.camera;
Enneaphalanx.prototype.scene.Recur.prototype.step = SceneGraph.prototype.Scener.prototype.step;
Enneaphalanx.prototype.scene.Recur.prototype.make_scene = SceneGraph.prototype.Scener.prototype.make_scene;
Enneaphalanx.prototype.scene.Recur.prototype.precompose = function(){
    var result = SceneGraph.prototype.Scener.prototype.precompose.apply(this, arguments);
    result.hint = this.hint;
    return result;
};
