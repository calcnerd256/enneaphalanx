function SceneGraph(canvasId){
    this.frame_number = 1;
    this.backlog = [[], []];
    this.dom = Object.create(this.dom);
    this.dom.config = {
	canvas_id: canvasId,
	parent: this
    };
    this.dom.parent = this;
}
