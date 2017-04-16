SceneGraph.prototype.step = function(level, ctx, w, h, time){
    if(level > this.backlog.length) return 0;
    if(level == this.backlog.length - 1)
	if(!this.backlog[level].length)
	    if(level > 1){
		this.backlog.pop();
		return 0;
	    }
    if(level >= this.backlog.length) return 0;
    if(this.backlog[level].length == 0)
	return level + 1;
    if(this.backlog.length - level < 2)
	this.backlog.push([]);
    var scene = [this.backlog[level].shift()];
    scene = this.scene(scene, ctx, 0, 0, w, h, time);
    var nextlog = this.backlog[level + 1];
    if(nextlog.length < 65536)
	[].push.apply(nextlog, scene);
    else
	this.backlog[level + 1] = nextlog.filter(
	    function(x, i, a){
		return (i+level) % 7 > 3;
	    }
	).concat(scene);
    return level;
};
