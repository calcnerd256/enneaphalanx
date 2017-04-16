Enneaphalanx.prototype.dom = {
    canvas: function(){
	return this.parent["scene graph"].dom.canvas();
    },
    start_paragraph: function(){
	return document.getElementById(
	    this.parent.config.start_id
	);
    }
};
