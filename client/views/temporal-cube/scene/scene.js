Session.set("useVrCamera", false);
var config = require('/config.json');

Scene = {
	scene: null,
	canvas: null,
	engine: null,
	camera: null,
	planes: [],
	frames: [],

	init: function(frames){

		console.log('init');
		console.log(frames);

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

		LoadingSpinnerFullScreen.hide();
	},

	createScene: function (canvas, engine, frames) {

		var scene = new BABYLON.Scene(engine);
		this.frames = frames;

		// setup some light
		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(100, 300, 100), scene);

		// remove prev camera
		var camera;
		if(Scene.camera) Scene.camera.detachControl(canvas);

		if(Session.get("useVrCamera")){
			camera = new BABYLON.VRDeviceOrientationFreeCamera("VRCamera", BABYLON.Vector3.Zero(), scene, false);
			camera.attachControl(canvas, true);
		}

		else {
			// ArcRotateCamera >> Camera rotating around a 3D point (here Vector zero)
			// Parameters : name, alpha, beta, radius, target, scene
			camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 0.9, 300, BABYLON.Vector3.Zero(), scene);
			camera.attachControl(canvas, true);
		}

		for(var i = 0; i < frames.length; i++){

			//Creation of plane
			// name, size, scene, optional side of orientation
			var plane = BABYLON.Mesh.CreatePlane("plane", 120, scene);
			plane.position.x = 0;
			plane.position.y = -(i * 20) + 30;
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

			materialPlane.backFaceCulling = false;//Always show the front and the back of an element
			materialPlane.diffuseTexture.hasAlpha = true;
			plane.material = materialPlane;

			// LABEL
			var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
			textPlaneTexture.drawText(FrameBuilder.elevations[i] + 'm', null, 150, "12px verdana", "white", "transparent");
			textPlaneTexture.hasAlpha = true;

			var textPlane = BABYLON.Mesh.CreatePlane("textPlane", 120, scene, false);
			textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
			textPlane.material = new BABYLON.StandardMaterial("textPlane", scene);
			textPlane.position = new BABYLON.Vector3(0, 2, 0);
			textPlane.position.y = -(i * 20) + 10;

			textPlane.material.diffuseTexture = textPlaneTexture;
			textPlane.material.specularColor = new BABYLON.Color3(0, 0, 0);
			textPlane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
			textPlane.material.backFaceCulling = false;

			Scene.planes.push(plane);
		}

		Scene.camera = camera;

		return scene;
	},

	updatePlaneMaterials: function(tIndex){

		for(var i = 0; i < Scene.planes.length; i++){

			var materialPlane = new BABYLON.StandardMaterial("ground", Scene.scene);
			materialPlane.diffuseTexture = new BABYLON.Texture(
				'data:my_image_name'+ i + tIndex, // needs a unique name
				Scene.scene,
				true,
				true,
				BABYLON.Texture.BILINEAR_SAMPLINGMODE,
				null,
				null,
				Scene.frames[i][tIndex], // incremented z, first time slice
				true
			);

			materialPlane.backFaceCulling = false; //Always show the front and the back of an element
			materialPlane.diffuseTexture.hasAlpha = true;
			Scene.planes[i].material = materialPlane;

		}
		//
		//Scene.engine.runRenderLoop(function () {
		//	Scene.scene.render();
		//});
	}

};
