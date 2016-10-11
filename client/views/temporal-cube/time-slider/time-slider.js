Session.set("timeSlice", '');

Template.timeSlider.onRendered(function(){

	TimeSlider.slider = new Foundation.Slider($('#time-slider'), {});

	$('#time-slider').on('moved.zf.slider', function(){

		var index = $("#time-slider-input").val();

		console.log(index);

		Scene.updatePlaneMaterials(index);
		Session.set("timeSlice", FrameBuilder.times[index]);

	});

});

Template.timeSlider.helpers({

	maxValue: function(){
		return FrameBuilder.times.length - 1;
	}

});

TimeSlider = {

	slider: null,
	updateMax: function(max){
		this.slider = new Foundation.Slider($('#time-slider'), { end: max });
	}

};