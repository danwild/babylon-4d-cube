module.exports = {

	/*
	 https://github.com/kadirahq/meteor-up
	 mup setup
	 mup deploy
	 TODO make sure mongo port is reachable (27017)
	 if auth issues try adding ssh key to ssh-agent
	 */


	servers: {
		one: {
			host: '54.66.186.245',
			username: 'ubuntu',
			pem: "/Users/danielwild/GoogleDrive/aws/keys/csiro-sydney.pem",
			opts: {
				port: 22
			}
		}
	},

	meteor: {

		// unofficial fix for meteor 1.4
		// https://github.com/kadirahq/meteor-up/issues/172
		// https://github.com/arunoda/meteor-up/issues/1091
		dockerImage: 'abernix/meteord:base',

		name: 'babylon4dcube',
		path: '/Users/danielwild/GoogleDrive/Git/babylon-4d-cube',

		servers: {
			one: {}
		},
		buildOptions: {
			serverOnly: true,
			debug: true,
			cleanAfterBuild: true // default
		},
		env: {
			ROOT_URL: 'http://54.66.186.245',
			MONGO_URL: 'mongodb://localhost/babylon4dcube'
		},

		deployCheckWaitTime: 30 //default 10
	},

	mongo: {
		oplog: true,
		port: 27017,
		servers: {
			one: {}
		}
	}

};
