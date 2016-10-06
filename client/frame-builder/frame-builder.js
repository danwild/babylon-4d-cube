const querystring = require('querystring');

FrameBuilder = {

	frames: [],

	url: "http://dapds00.nci.org.au/thredds/wms/eReefs/model_data/gbr4_2.0.ncml",

	// your WMS query params
	params: {
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


	//times: ["2016-10-01T14:00:00.000Z", "2016-10-01T15:00:00.000Z", "2016-10-01T16:00:00.000Z", "2016-10-01T17:00:00.000Z", "2016-10-01T18:00:00.000Z", "2016-10-01T19:00:00.000Z", "2016-10-01T20:00:00.000Z", "2016-10-01T21:00:00.000Z", "2016-10-01T22:00:00.000Z", "2016-10-01T23:00:00.000Z", "2016-10-02T00:00:00.000Z", "2016-10-02T01:00:00.000Z", "2016-10-02T02:00:00.000Z", "2016-10-02T03:00:00.000Z", "2016-10-02T04:00:00.000Z", "2016-10-02T05:00:00.000Z", "2016-10-02T06:00:00.000Z", "2016-10-02T07:00:00.000Z", "2016-10-02T08:00:00.000Z", "2016-10-02T09:00:00.000Z", "2016-10-02T10:00:00.000Z", "2016-10-02T11:00:00.000Z", "2016-10-02T12:00:00.000Z", "2016-10-02T13:00:00.000Z"],
	//elevations: ["-0.5", "-23.75", "-49.0", "-103.5"],

	times: [
		"2016-10-01T14:00:00.000Z"
	],
	elevations: [
		"-0.5",
		"-23.75",
		"-49.0",
		"-103.0",
		"-170.0"
	],

	/**
	 * Setup the nested shell from config
	 */
	init: function(){

		var requests = [];

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

		console.log(FrameBuilder.frames);

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

