import {encode, decode} from 'node-base64-image';

Meteor.methods({

	crossDomainProxy: function (url, options, method) {

		this.unblock();

		var params = {
			headers: {
				Accept: "text/javascript, application/xml, text/xml, text/html, */*"
			}
		};

		if (options) _.extend(params, options);

		try {
			return HTTP.call(method, url, params);
		}
		catch (e) {
			throw new Meteor.Error(500, 'Error 500: Get request failed', e);
		}
	},

	loadS3Frames: function(args){
		this.unblock();
		return Promise.all(S3RequestHandler.loadFrames(args));
	},

	loadFrames: function(args){
		this.unblock();
		return Promise.all(WmsRequestHandler.loadFrames(args));
	},

	getBase64Image: function(url){
		return new Promise((resolve, reject) => {
			encode(url, {string: true}, function (err, res) {
				if(err) reject(err);
				resolve('data:image/png;base64,' + res);
			});
		});
	}

});