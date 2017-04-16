SceneGraph.prototype.dom = {
    canvas: function(){
	return document.getElementById(
	    this.parent.dom.config.canvas_id
	);
    }
};
