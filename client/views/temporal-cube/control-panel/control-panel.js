Template.controlPanel.events({

	"click .load-frames-mh": function(){
		FrameBuilder.initS3();
	},

	"click .load-frames-gbr": function(){

		// assign query params
		FrameBuilder.times = FrameBuilder.gbrTimes;
		FrameBuilder.elevations = FrameBuilder.gbrElevations;
		FrameBuilder.params = FrameBuilder.gbrParams;
		FrameBuilder.url = FrameBuilder.gbrUrl;

		LoadingSpinnerFullScreen.show("Pre-loading "+ (FrameBuilder.times.length * FrameBuilder.elevations.length) +" frames\n\n(go grab a coffee)");
		FrameBuilder.init(false);
	},

	"click .load-frames-gladstone": function(){

		// assign query params
		FrameBuilder.times = FrameBuilder.gladstoneTimes;
		FrameBuilder.elevations = FrameBuilder.gladStoneElevations;
		FrameBuilder.params = FrameBuilder.gladstoneParams;
		FrameBuilder.url = FrameBuilder.gladstoneUrl;

		LoadingSpinnerFullScreen.show("Pre-loading "+ (FrameBuilder.times.length * FrameBuilder.elevations.length) +" frames\n\n(go grab a coffee)");
		FrameBuilder.init(false);
	},

	"click .demo-frames": function(){
		FrameBuilder.init(true);
	},

	"click .play": function(){
		ControlPanel.play();
	},

	"click .pause": function(){
		ControlPanel.pause();
	},

	"click .vr-enabled": function(e){
		Session.set("useVrCamera", e.currentTarget.value === 'true');
	}

});

Template.controlPanel.helpers({

	timeSlice: function () {
		//if(FrameBuilder.frames.length > 0) return Session.get("timeSlice");
		return Session.get("timeSlice");
	}

});

ControlPanel = {

	animate: false,
	timer: null,
	frameIndex: 0,

	forward: function(){
		var nextIndex = this.frameIndex + 1;
		if(nextIndex > FrameBuilder.times.length - 1){
			nextIndex = 0;
		}
		this.setFrameIndex(nextIndex);
		return nextIndex;
	},

	backward: function(){
		var nextIndex = this.frameIndex - 1;
		if(nextIndex < 0){
			nextIndex = FrameBuilder.times.length - 1;
		}
		this.setFrameIndex(nextIndex);
		return nextIndex;
	},

	play: function(){
		this.animate = true;
		if(this.timer) clearTimeout(this.timer);
		this.animateLoop();
	},

	pause: function(){
		this.animate = false;
		if(this.timer) clearTimeout(this.timer);
	},

	animateLoop: function(){
		if(!ControlPanel.animate && ControlPanel.timer){
			clearTimeout(ControlPanel.timer);
			return;
		}
		ControlPanel.timer = setTimeout(function(){
			ControlPanel.forward();
			ControlPanel.animateLoop();
		}, 200);
	},

	setFrameIndex: function(index){
		if(!FrameBuilder.times) return;
		index = parseInt(index);
		this.frameIndex = index;
		window.dispatchEvent(new CustomEvent('wmsAnimatorFrameIndexEvent', { detail: index }));
	},

	frameUpdateListener: function(e){
		Session.set("timeSlice", FrameBuilder.times[parseInt(e.detail)]);
		ControlPanel.setSliderValue(parseInt(e.detail));
	},

	setSliderValue: function(value){
		// not seeing a way in docs to update slider value programatically without re-init..
		new Foundation.Slider( $("#time-slider"), { initialStart: value, end: FrameBuilder.times.length - 1 });
	}

};

// listen for frame updates
Template.controlPanel.onCreated(function(){
	window.addEventListener('wmsAnimatorFrameIndexEvent', ControlPanel.frameUpdateListener);
});

Template.controlPanel.onDestroyed(function(){
	window.removeEventListener('wmsAnimatorFrameIndexEvent', ControlPanel.frameUpdateListener);
});