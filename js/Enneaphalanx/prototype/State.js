Enneaphalanx.prototype.State = function State(generate_scene, next_state, parent, state){
    this.keypresses = [];
    this.scene = generate_scene;
    this.transition = next_state;
    this.parent = parent;
    this.state = state;
};
Enneaphalanx.prototype.State.prototype.tick = function tick(){
    return new Promise(
	function(res, rej){
	    window.setTimeout(res, 50);
	}
    );
};
Enneaphalanx.prototype.State.prototype.step = function step(){
    if(!this.keypresses.length) return;
    this.state = this.transition(this.keypresses.shift());
};
Enneaphalanx.prototype.State.prototype.run = function run(){
    return Promise.all(
	[
	    this.tick.bind(this),
	    this.step.bind(this)
	].map(
	    function(f){
		return Promise.resolve().then(
		    f
		);
	    }
	)
    ).then(this.run.bind(this));
};
Enneaphalanx.prototype.State.StateMachine = function StateMachine(scene, parent, transitions, start){
    start.transitions = transitions;
    Enneaphalanx.prototype.State.call(
	this,
	scene,
	this.transition,
	parent,
	start
    );
};
Enneaphalanx.prototype.State.StateMachine.prototype = Object.create(
    Enneaphalanx.prototype.State.prototype
);
Enneaphalanx.prototype.State.StateMachine.prototype.transition = function transition(i){
    if(!this.state) return this.state;
    if(!this.state.transitions) return this.state;
    i %= this.state.transitions.length;
    i += this.state.transitions.length;
    i %= this.state.transitions.length;
    if(!this.state.transitions[i]) return this.state;
    return this.state.transitions[i];
}
