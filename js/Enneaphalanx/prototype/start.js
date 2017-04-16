Enneaphalanx.prototype.start = {
    is_start: function is_start(){
	return !!this.parent.dom.start_paragraph();
    },
    remove_hint: function(){
	return Promise.resolve(
	    this.parent.dom.start_paragraph().remove()
	);
    },
    listen_keys: function(){
	return Promise.resolve(
	    this.parent.event.bind("canvas", "keydown", "key")
	);
    },
    animate: function(){
	var sg = this.parent["scene graph"];
	var state = this.parent.state;
	return sg.next_frame().then(
	    function(t){
		return sg.frame(t, state)
	    }
	);
    },
    simulate: function(){
	return this.parent.state.run();
    },
    init: function init(){
	return Promise.race(
	    [
		Promise.all(
		    [
			this.remove_hint(),
			this.listen_keys()
		    ]
		),
		this.animate().then(
		    console.info.bind(
			console,
			"animation ended",
			this.parent
		    ),
		    console.error.bind(console, "animation")
		),
		this.simulate().then(
		    console.info.bind(
			console,
			"simulation ended",
			this.parent
		    ),
		    console.error.bind(console, "simulation")
		)
	    ]
	);
    }
};
