var AWS = require('aws-sdk');
//var credentials = new AWS.SharedIniFileCredentials({profile: 'csiro'});
//AWS.config.credentials = credentials;

// you can also store credentials in private server config
//AWS.config.update({
//	accessKeyId: Meteor.settings.private.aws.aws_access_key_id,
//	secretAccessKey: Meteor.settings.private.aws.aws_secret_access_key,
//	region: 'ap-southeast-2'
//});
var s3 = new AWS.S3();



S3RequestHandler = {

	loadFrames: function(args){

		console.log('loadFrames');

		var promises = [];
		_.each(args.keys, function(key){
			promises.push(S3RequestHandler.wrapS3Promise(args.bucket, key));
		});
		return promises;
	},


	wrapS3Promise: function(bucket, key){

		return new Promise((resolve, reject) => {

			var getParams = {Bucket: bucket, Key: key + '.json'};

			s3.getObject(getParams, function (err, data) {

				if(err){
					reject(err);
				}
				let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
				resolve(JSON.parse(objectData));
			});
		});
	}

};