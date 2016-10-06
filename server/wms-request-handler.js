import {encode, decode} from 'node-base64-image';
const querystring = require('querystring');

WmsRequestHandler = {

	frames: [],

	loadFrames: function(args){

		var promises = [];

		// for each z plane, add all time (t) indexes
		for(var z = 0; z < args.elevations.length; z++){

			for(var t = 0; t < args.times.length; t++){

				var request = this.buildRequest(args, z, t);

				console.log(request);

				promises.push(WmsRequestHandler.getBase64Image(request, z, t));
			}
		}

		return promises;
	},

	buildRequest: function(args, zIndex, tIndex){

		args.wmsParams.elevation = args.elevations[zIndex];
		args.wmsParams.time = args.times[tIndex];

		return args.url + '?' + querystring.stringify(args.wmsParams);
	},

	getBase64Image: function(url, zIndex, tIndex){
		return new Promise((resolve, reject) => {
			encode(url, { string: true }, function (err, res) {
				if(err) reject(err);
				resolve({
					img: 'data:image/png;base64,' + res,
					zIndex: zIndex,
					tIndex: tIndex
				});
			});
		});
	}

};