function example(){
    function old(){
	var state = {
	    fillStyle: "green",
	    xOffset: 0
	};
	var transitions = [
	    "red",
	    "orange",
	    "yellow",
	    "green",
	    "cyan",
	    "blue",
	    "magenta",
	    "black",
	    "gray"
	].map(
	    function(color, i){
		var result = Object.create(state);
		result.fillStyle = color;
		return result;
	    }
	);
	var sceneGraph = new SceneGraph("canv");
	function filledSquare(fillStyle){
	    return function(ctx, left, top, width, height, time){
		var s = width;
		if(s > height) s = height;
		ctx.fillStyle = fillStyle;
		ctx.fillRect(left, top, s, s);
		return [];
	    }
	}
	function scene(sceneGraph){
	    var get = this.parent.get("get");
	    var K = get("K");
	    var Scener = sceneGraph.Scener;
	    var xOffset = this.state.xOffset;
	    function fallSquare(ctx, left, top, width, height, time){
		var side = width;
		if(side > height) side = height;
		var s = side / 10;
		var y = (time[0] / 80 * s) % (side - s);
		var l = left + xOffset * s;
		if(l < left) l = left;
		if(l - left > width - s)
		    l = left + width - s;
		return [ctx, l, top + y, s, s, time];
	    }
	    return [
		new Scener(
		    [fallSquare],
		    filledSquare,
		    K(this.state.fillStyle)
		)
	    ];
	}
	function transition(i){
	    var StateMachine = Enneaphalanx.prototype.State.StateMachine;
	    var result = Object.create(
		StateMachine.prototype.transition.apply(this, arguments)
	    );
	    var xOffset = this.state.xOffset;
	    result.transitions = result.transitions.map(
		function(s){
		    var result = Object.create(s);
		    result.xOffset = xOffset + i - 4;
		    return result;
		}
	    );
	    return result;
	}
	function constructState(parent){
	    state.parent = parent;
	    var result = new (Enneaphalanx.prototype.State.StateMachine)(
		scene,
		parent,
		transitions,
		state
	    );
	    result.transition = transition;
	    return result;
	}
	return new Enneaphalanx(sceneGraph, "start", constructState);
    }
    function replacement(){
	return new Enneaphalanx(
	    new SceneGraph("canv"),
	    "start",
	    function constructState(parent){
		return new Enneaphalanx.prototype.State(
		    function scene(sceneGraph){
			var K = this.parent.get("get")("K");
			if(!("cache" in this.state)) this.state.cache = {};
			if(!("fillStyle" in this.state.cache))
			    this.state.cache.fillStyle = "rgb(" + "red green blue".split(" ").map(
				(function(k){return this.state[k]}).bind(this)
			    ).join(", ") + ")";
			return [
			    new (sceneGraph.Scener)(
				[],
				function(fillStyle, x){
				    return function(ctx, left, top, width, height, time){
					var s = width;
					if(s > height) s = height;
					ctx.fillStyle = fillStyle;
					var cx = left + width * x * .9;
					var cy = top + height / 2;
					s /= 4;
					cy -= s / 2;
					if(cx + s > width + left)
					    cx = width + left - s;
					ctx.fillRect(cx, cy, s, s);
					return [];
				    }
				},
				K(this.state.cache.fillStyle),
				K(this.state.x)
			    )
			];
		    },
		    function transition(i){
			if(!("cache" in this.state)) this.state.cache = {};
			if(i in this.state.cache) return this.state.cache[i];
			var r = this.state.red;
			var g = this.state.green;
			var b = this.state.blue;
			var change = 0;
			var cursor = 0;
			var dx = 0;
			if("red" == this.state.cursor) cursor = 0;
			if("green" == this.state.cursor) cursor = 1;
			if("blue" == this.state.cursor) cursor = 2;
			if(0 == i) dx--;
			if(1 == i) dx++;
			if(2 == i) cursor--;
			if(3 == i) cursor++;
			if(5 == i) change--;
			if(6 == i) change++;
			cursor %= 3;
			cursor += 3;
			cursor %= 3;
			change *= 32;
			if(0 == cursor) r += change;
			if(1 == cursor) g += change;
			if(2 == cursor) b += change;
			if(r < 0) r = 0;
			if(r > 255) r = 255;
			if(g < 0) g = 0;
			if(g > 255) g = 255;
			if(b < 0) b = 0;
			if(b > 255) b = 255;
			var x = this.state.x;
			x += dx / 8;
			if(x < 0) x = 0;
			if(x > 1) x = 1;
			this.state.cache[i] = {
			    red: r,
			    green: g,
			    blue: b,
			    x: x,
			    cursor: "red green blue".split(" ")[cursor],
			    parent: this.state.parent
			};
			return this.state.cache[i];
		    },
		    parent,
		    {
			red: 0,
			green: 128,
			blue: 255,
			x: .5,
			cursor: "blue",
			parent: parent
		    }
		);
	    }
	);
    }
    return (!true?old:replacement)();
}
