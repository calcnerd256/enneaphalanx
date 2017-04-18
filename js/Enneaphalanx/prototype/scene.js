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
    fractals: {
	"": function(sceneGraph, state){
	    var get = this.parent.get("get");
	    var K = get("K");
	    var Scener = sceneGraph.Scener;
	    var Recur = this.Recur;
	    var stateScene = state.scene(sceneGraph);
	    return sceneGraph.make_scene.apply(
		null,
		[
		    [],
		    new (Scener.Atomic)(
			[
			    new Scener([this.main], K(this.clear)),
			    new Scener([this.main], K(this.outline))
			].concat(
			    sceneGraph.make_scene.apply(
				null,
				[[this.main]].concat(stateScene)
			    )
			)
		    )
		].concat(
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
	},
	"midleft": function(sceneGraph, state){
	    var get = this.parent.get("get");
	    var K = get("K");
	    function outer(n, isTop){
		return function(ctx, left, top, width, height, time){
		    width /= 4;
		    left += n * width;
		    if(!isTop)
			top += height - width;
		    var gap = 5;
		    return [ctx, left+gap, top+gap, width-2*gap, width-2*gap, time];
		}
	    }
	    var that = this;
	    var Recur = this.Recur;
	    var Scener = sceneGraph.Scener;
	    function recur(i, state, camera){
		var scene = that;
		var result = {
		    camera: Scener.prototype.camera,
		    step: Scener.prototype.step,
		    make_scene: Scener.prototype.make_scene,
		    transforms: [camera],
		    scener: K(
			function(ctx, left, top, width, height, time){
			    var s = Object.create(scene.parent.state);
			    s.state = state.transition(i);
			    ctx.strokeStyle = "red orange yellow green cyan blue magenta black gray".split(" ")[i];
			    ctx.strokeRect(left, top, width, height);
			    return scene.fractal(sceneGraph, s);
			}
		    ),
		    args: [],
		    hint: ["recur", i, state, camera],
		    precompose: Recur.prototype.precompose
		};
		return result;
	    }
	    var top = [0, 1, 2, 3].map(
		function(n){
		    return recur(n, state, outer(n, true));
		}
	    );
	    var bot = [5, 6, 7, 8].map(
		function(n){
		    return recur(n, state, outer(n - 5, false));
		}
	    );
	    function inner(isLeft){
		return function(ctx, left, top, width, height, time){
		    top += width / 4;
		    height -= width / 2;
		    var doTall = 3 * width > 2 * height;
		    if(doTall){
			width /= 2;
			if(!isLeft) left += width;
		    }
		    else{
			height /= 2;
			if(!isLeft) top += height;
		    }
		    var gap = isLeft ? 0 : 10;
		    return [ctx, left+gap, top+gap, width-2*gap, height-2*gap, time];
		};
	    }
	    var mainCamera = inner(true);
	    var main = new (sceneGraph.Scener.Atomic)(
		[
		    new Scener([], K(this.outline)),
		    new Scener([mainCamera], K(this.clear)),
		    new Scener([mainCamera], K(this.outline))
		].concat(
		    sceneGraph.make_scene.apply(
			null,
			[[mainCamera]].concat(state.scene(sceneGraph))
		    )
		)
	    );
	    var thumb = recur(4, state, inner(false));
	    return sceneGraph.make_scene.apply(
		sceneGraph,
		[
		    [],
		    main,
		    thumb
		].concat(top, bot)
	    );
	},
	"view mode": !true ? "" : "midleft"
    },
    fractal: function(sceneGraph, state){
	var whichOne = this.fractals["view mode"];
	return this.fractals[whichOne].apply(this, arguments);
    }
};
Enneaphalanx.prototype.scene.Recur = function Recur(i, state, that, sceneGraph){
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
};
Enneaphalanx.prototype.scene.Recur.prototype.camera = SceneGraph.prototype.Scener.prototype.camera;
Enneaphalanx.prototype.scene.Recur.prototype.step = SceneGraph.prototype.Scener.prototype.step;
Enneaphalanx.prototype.scene.Recur.prototype.make_scene = SceneGraph.prototype.Scener.prototype.make_scene;
Enneaphalanx.prototype.scene.Recur.prototype.precompose = function(){
    var result = SceneGraph.prototype.Scener.prototype.precompose.apply(this, arguments);
    result.hint = this.hint;
    return result;
};
