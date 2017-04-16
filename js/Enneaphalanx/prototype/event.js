Enneaphalanx.prototype.event = {
    do_click: function click(that){
	var get = that.get("get");
	var enneaphalanx = that;
	var start = that.start;
	return get("cond")(
	    [
		"is_start init".split(" ").map(get("bind from")(start))
	    ]
	);
    },
    key: function canvas_key(evt){
	var button_number = "aoeu htns".indexOf(evt.key);
	if(-1 == button_number) return;
	this.parent.state.keypresses.push(button_number);
    },
    bind: function bind_event(dom, event, key){
	return this.parent.dom[dom]().addEventListener(
	    event,
	    window.applications.util.associate(
		[
		    this.parent.get,
		    "get",
		    "bind from",
		    this,
		    key
		]
	    )
	);
    }
};
