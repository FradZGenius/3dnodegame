Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';


var initScene, render, renderer, scene, camera, box, raycaster, canvas;

var mouse = new THREE.Vector2();

var socket = io();

var playerBox = new THREE.Box3();

var playerVel = new THREE.Vector3();

var ground;
var groundBox = new THREE.Box3();

let testV = new THREE.Vector3(10,5,5);
let testAxis = new THREE.Vector3(.707,.707,0);



var player;

(
	function () {
		var script = document.createElement('script');
		script.onload = function () {
			var stats = new Stats();
			document.body.appendChild(stats.dom);
			requestAnimationFrame(function loop() {
				stats.update();
				requestAnimationFrame(loop)
			});
		};
		script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js';
		document.head.appendChild(script);
	}
)()

var bboxTest;

initScene = function() {
	raycaster = new THREE.Raycaster();
	
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
	canvas = renderer.domElement;
  document.body.appendChild( renderer.domElement );
	canvas.addEventListener('mousemove',function(evnt){
		mouse = new THREE.Vector2(evnt.offsetX, evnt.offsetY)
	});

	scene = new THREE.Scene;
	
	camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
	);
	camera.position.set( -100, 0, 0 );
	camera.lookAt( scene.position );
	scene.add( camera );
	
	// Box
	player = new THREE.Mesh(
			new THREE.BoxBufferGeometry( 10, 10, 10 ),
			new THREE.MeshBasicMaterial({ color: 0xff0000 })
	);
	scene.add( player );
	
	player.position.set(0,60,0);

	bboxTest = new BoundingBox(player);

	//socket.emit('debug',bboxTest.depth)

	playerBox.setFromObject(player);

	//scene.add( playerBox );
	ground = new THREE.Mesh(
			new THREE.BoxBufferGeometry(50,5,50),
			new THREE.MeshBasicMaterial({ color: 0xffffff })
	);
	ground.name = "bruh";
	scene.add(ground);

	groundBox.setFromObject(ground);
	ground.position.set(0,0,0)
	ground.rotation.set(0,0,10)
	
	console.log()

    //scene.add(groundBox);

    requestAnimationFrame( render );
    const helper = new THREE.Box3Helper( playerBox, 0xffff00 );
    scene.add( helper );
};

//leading bounding box that extends in direction
//of player's velocity, detects collisions
//raycast from player to collision to see what face
//take other 2 vectors that are not equal
//to the normal of the face to 

render = function() {
	//camera.lookAt( player.position );
	let camLook = new THREE.Vector3(camera.matrix.elements[8],camera.matrix.elements[9],camera.matrix.elements[10]);
	raycaster.setFromCamera(mouse,camera);
	if(raycaster.intersectObjects(scene.children)[0]){
		//socket.emit('debug',raycaster.intersectObjects(scene.children))
	}

	renderer.render( scene, camera); // render the scene
	requestAnimationFrame( render );

	playerVel.add(new THREE.Vector3(0,-.001,-.00001))

	let prevMin = playerBox.min.clone();
	bboxTest.updateValues();


	playerBox.min.add(playerVel);

	let prevMax = playerBox.max.clone();
	playerBox.max.add(playerVel);

	let prevPos = bboxTest.position;
	bboxTest.position.add(playerVel);
	bboxTest.intersectsBox(ground);
	//ground.
	scene.children.forEach((object)=>{
		//if(player.position.distanceTo(object.position) <= playerVel){

		//}
		
		if(bboxTest.intersectsBox(ground)){
			let testCaster = new THREE.Raycaster();
			//to - from
			let gbCenter = new THREE.Vector3();
			groundBox.getCenter(gbCenter);

			testCaster.set(player.position, (gbCenter.sub(player.position).normalize()));
			//console.log(testCaster.intersectObject(ground)[0].face.normal);
			let intersect = testCaster.intersectObject(ground)[0];
			let face = intersect.face;
			console.log(intersect)

			let faceNorm = face.normal;
			faceNorm.transformDirection(ground.matrixWorld);
			let proj = playerVel.clone().projectOnPlane(faceNorm);

			//console.log(face);
			playerVel.copy(proj);
			
		}
		
	});
	playerBox.min.copy(prevMin.add(playerVel));
	playerBox.max.copy(prevMax.add(playerVel));

	bboxTest.position.copy(prevPos.add(playerVel));

	let b = new THREE.Vector3();
	playerBox.getCenter(b);
	player.position.copy(b);
};

window.onload = initScene();