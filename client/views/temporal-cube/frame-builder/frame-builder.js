const querystring = require('querystring');

FrameBuilder = {

	frames: [],
	times: [],
	elevations: [],
	params: {},
	url: '',

	gladstoneUrl: "http://acef.tern.org.au/thredds/wms/shoc/gladstone_harbour/aggregate.nc",

	// your WMS query params
	gladstoneParams: {
		BBOX: "151.0923464,-24.1394897,151.7364907,-23.589854",
		LAYERS: "Chl_a_sum",
		SRS: "EPSG:4326",
		VERSION: "1.1.1",
		WIDTH: 1024,
		HEIGHT: 1024,
		SERVICE: "WMS",
		REQUEST: "GetMap",

		// ncWMS params
		abovemaxcolor: "extend",
		belowmincolor: "extend",
		colorscalerange: "0.01576272,0.34310514",
		elevation: "-8.3",
		format: "image/png",
		layers: "Chl_a_sum",
		logscale: false,
		numcolorbands: "50",
		opacity: "100",
		styles: "boxfill/rainbow",
		transparent: true,

		// dynamic params
		elevation: null,
		time: null
	},

	gladStoneElevations: [
		"-0.2",
		"-1.35",
		"-2.55",
		"-4.2",
		"-6.65",
		"-8.3"
	],

	gladstoneTimes: [
		"2016-03-07T14:00:00.000Z",
		"2016-03-08T14:00:00.000Z",
		"2016-03-09T14:00:00.000Z",
		"2016-03-10T14:00:00.000Z",
		"2016-03-11T14:00:00.000Z",
		"2016-03-12T14:00:00.000Z",
		"2016-03-13T14:00:00.000Z",
		"2016-03-14T14:00:00.000Z",
		"2016-03-15T14:00:00.000Z",
		"2016-03-16T14:00:00.000Z",
		"2016-03-17T14:00:00.000Z",
		"2016-03-18T14:00:00.000Z"

		//,
		//"2016-03-19T14:00:00.000Z",
		//"2016-03-20T14:00:00.000Z",
		//"2016-03-21T14:00:00.000Z",
		//"2016-03-22T14:00:00.000Z",
		//"2016-03-23T14:00:00.000Z",
		//"2016-03-24T14:00:00.000Z",
		//"2016-03-25T14:00:00.000Z",
		//"2016-03-26T14:00:00.000Z",
		//"2016-03-27T14:00:00.000Z",
		//"2016-03-28T14:00:00.000Z",
		//"2016-03-29T14:00:00.000Z",
		//"2016-03-30T14:00:00.000Z"
	],

	gbrUrl: "http://dapds00.nci.org.au/thredds/wms/eReefs/model_data/gbr4_2.0.ncml",

	// your WMS query params
	gbrParams: {
		BBOX: "142.168788,-28.6960218,156.8856378,-7.011908200000001",
		LAYERS: "temp",
		SRS: "EPSG:4326",
		VERSION: "1.1.1",
		WIDTH: 768,
		HEIGHT: 1024,
		SERVICE: "WMS",
		REQUEST: "GetMap",

		// ncWMS params
		abovemaxcolor: "extend",
		belowmincolor: "extend",
		colorscalerange: "20.550272,30.7662",
		format: "image/png",
		logscale: false,
		numcolorbands: "50",
		opacity: "100",
		styles: "boxfill/rainbow",
		transparent: true,

		// dynamic params
		elevation: null,
		time: null
	},

	gbrTimes: [
		"2016-09-10T06:00:00.000Z",
		//"2016-09-11T06:00:00.000Z",
		//"2016-09-12T06:00:00.000Z",
		//"2016-09-13T06:00:00.000Z",
		//"2016-09-14T06:00:00.000Z",
		//"2016-09-15T06:00:00.000Z",
		//"2016-09-16T06:00:00.000Z",
		//"2016-09-17T06:00:00.000Z",
		//"2016-09-18T06:00:00.000Z",
		//"2016-09-19T06:00:00.000Z",
		//"2016-09-20T06:00:00.000Z",
		//"2016-09-21T06:00:00.000Z",
		//"2016-09-22T06:00:00.000Z",
		//"2016-09-23T06:00:00.000Z",
		//"2016-09-24T06:00:00.000Z",
		//"2016-09-25T06:00:00.000Z",
		//"2016-09-26T06:00:00.000Z",
		//"2016-09-27T06:00:00.000Z",
		//"2016-09-28T06:00:00.000Z",
		//"2016-09-29T06:00:00.000Z",
		//"2016-09-30T14:00:00.000Z",
		//"2016-10-01T06:00:00.000Z",
		//"2016-10-02T05:00:00.000Z",
		//"2016-10-02T14:00:00.000Z"
	],

	gbrElevations: [
		"-0.5",
		"-23.75",
		"-49.0",
		"-103.0",
		"-170.0"
	],

	/**
	 * Setup the nested shell from config
	 */
	init: function(isDemo){

		// show a static timeslice if thredds is being naughty
		if(isDemo){
			Scene.init(DemoFrames);
			return;
		}

		TimeSlider.updateMax(FrameBuilder.times.length - 1);

		// a plane for each elevation point
		for(var i = 0; i < this.elevations.length; i++){
			FrameBuilder.frames.push([]);
		}

		// for each plane, add all time indexes
		for(var i = 0; i < FrameBuilder.frames.length; i++){

			for(var n = 0; n < this.times.length; n++){
				FrameBuilder.frames[i][n] = '';
			}
		}

		this.loadFrames();
	},

	loadFrames: function(){

		Meteor.call('loadFrames', {

			url: FrameBuilder.url,
			wmsParams: FrameBuilder.params,
			times: FrameBuilder.times,
			elevations: FrameBuilder.elevations

		}, function(err, frames) {

			if (err) {
				console.log(err);
				LoadingSpinnerFullScreen.hide();
				alert(err.message);
			}

			else {
				console.log('great success');
				FrameBuilder.formatFrames(frames);

				Scene.init(FrameBuilder.frames);
			}
		});

	},

	formatFrames: function(frames){

		console.log(frames);

		frames.forEach(function(frame){
			FrameBuilder.frames[frame.zIndex][frame.tIndex] = frame.img;
		});

		console.log(FrameBuilder.frames);
	},

	buildRequest: function(zIndex, tIndex){

		this.params.elevation = this.elevations[zIndex];
		this.params.time = this.times[tIndex];

		return this.url + '?' + querystring.stringify(this.params);
	},

	getImage: function(zIndex, tIndex){

		var request = this.buildRequest(zIndex, tIndex);

		console.log(request);

		Meteor.call('getBase64Image', request, function(err, base64Img) {

			if (err) {
				console.log(err);
			}

			else {
				console.log('great success');

				FrameBuilder.frames[zIndex][tIndex] = base64Img;
			}
		});

	}

};

