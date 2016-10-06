var config = require('/config.json');

Scene = {

	scene: null,
	canvas: null,
	engine: null,
	planes: [],

	init: function(frames){

		this.canvas = document.getElementById("renderCanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.scene = this.createScene(this.canvas, this.engine, frames);

		this.engine.runRenderLoop(function () {
			Scene.scene.render();
		});

		// Resize
		window.addEventListener("resize", function () {
			Scene.engine.resize();
		});
	},

	createScene: function (canvas, engine, frames) {

		var scene = new BABYLON.Scene(engine);

		//Create a light
		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(100, 100, 100), scene);

		// ArcRotateCamera >> Camera rotating around a 3D point (here Vector zero)
		// Parameters : name, alpha, beta, radius, target, scene
		var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 0.9, 200, BABYLON.Vector3.Zero(), scene);
		camera.attachControl(canvas, true);

		BABYLON.Tools.Log("blah");


		for(var i = 0; i < frames.length; i++){

			//Creation of a plane
			// name, size, scene, optional side of orientation
			var plane = BABYLON.Mesh.CreatePlane("plane", 120, scene);
			plane.position.x = 20;
			plane.position.y = -(i * 20);
			plane.rotation.x = Math.PI / 2;
			plane.rotation.y = -1.6;

			var materialPlane = new BABYLON.StandardMaterial("ground", scene);

			materialPlane.diffuseTexture = new BABYLON.Texture(
				'data:my_image_name'+i,
				scene,
				true,
				true,
				BABYLON.Texture.BILINEAR_SAMPLINGMODE,
				null,
				null,
				frames[i][0], // incremented z, first time slice
				true
			);

			//materialPlane.diffuseTexture = new BABYLON.Texture("img/0/macq_5m_nrt.png", scene);

			materialPlane.backFaceCulling = false;//Always show the front and the back of an element
			materialPlane.diffuseTexture.hasAlpha = true;
			plane.material = materialPlane;

		}




		//Creation of a plane
		// name, size, scene, optional side of orientation
		//var plane = BABYLON.Mesh.CreatePlane("plane", 120, scene);
		//plane.position.x = 20;
		//plane.position.y = -30;
		//plane.rotation.x = Math.PI / 2;
		//plane.rotation.y = -1.6;
		//
		////Creation of a repeated textured material
		//var materialPlane = new BABYLON.StandardMaterial("ground", scene);
		//materialPlane.diffuseTexture = new BABYLON.Texture("img/0/macq_10m_nrt.png", scene);
		//materialPlane.backFaceCulling = false;//Always show the front and the back of an element
		//materialPlane.diffuseTexture.hasAlpha = true;
		//plane.material = materialPlane;

		return scene;
	}

};

Template.scene.onRendered(function(){
	FrameBuilder.init();
	//Scene.init();
});