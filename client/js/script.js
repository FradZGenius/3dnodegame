var initScene, render, renderer, scene, camera, box, raycaster, canvas;

var mouse = new THREE.Vector2();

var socket = io();

var playerVel = new THREE.Vector3();

var ground;
var groundBox = new THREE.Box3();

let testV = new THREE.Vector3(10,5,5);
let testAxis = new THREE.Vector3(.707,.707,0);

var clock = new THREE.Clock();

var gravity = 100
var speed = 100;

function rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


var player;
var objs = [];
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
var controls;
var testBox2;

var keysDown = {};

var sprinting = false;

onKeydown = function(evnt){
	keysDown[evnt.key.toLowerCase()] = true;
	if(evnt.key === 'Shift'){
		sprinting = true;
	}
}

onKeyUp = function(evnt){
	delete keysDown[evnt.key.toLowerCase()];
	if(evnt.key === 'Shift'){
		sprinting = false;
	}
}

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
			90,
			window.innerWidth / window.innerHeight,
			1,
			1000
	);
	camera.rotation.set(0,rad(90),0)
	controls = new PointerLockControls(camera,canvas);

	scene.add( camera );
	document.body.addEventListener('click',()=>{
		controls.lock();
	});
	// Box
	player = new THREE.Mesh(
			new THREE.BoxBufferGeometry( 10, 10, 10 ),
			new THREE.MeshBasicMaterial({ color: 0xff0000 })
	);
	scene.add( player );
	
	player.position.set(0,60,0);

	bboxTest = new BoundingBox(player);

	//socket.emit('debug',bboxTest.depth)


	ground = new THREE.Mesh(
			new THREE.BoxBufferGeometry(500,5,50),
			new THREE.MeshToonMaterial({ color: 0xffffff })
	);
	ground.name = "bruh";
	scene.add(ground);

	groundBox.setFromObject(ground);
	ground.position.set(0,0,0)
	ground.rotation.set(rad(180),0,0)
	
	
	testBox2 = new THREE.Mesh(
		new THREE.BoxBufferGeometry(10,10,10),
		new THREE.MeshToonMaterial({color: 0xff00ff})
	)

	scene.add(testBox2);
	testBox2.position.set(-100,-10,0)
	testBox2.rotation.set(0,0,rad(45))
	let light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
	scene.add(light)
	//console.log()

    //scene.add(groundBox);

    requestAnimationFrame( render );
	objs.push(ground, testBox2)
};

//leading bounding box that extends in direction
//of player's velocity, detects collisions
//raycast from player to collision to see what face
//take other 2 vectors that are not equal
//to the normal of the face to 

document.addEventListener('keydown',onKeydown);
document.addEventListener('keyup',onKeyUp);


render = function() {
	//controls.lock();
	//camera.lookAt( player.position );
	let delta = clock.getDelta();
	let camLook = new THREE.Vector3(camera.matrix.elements[8],0,camera.matrix.elements[10]).normalize();
	let camRight = new THREE.Vector3(camera.matrix.elements[0],camera.matrix.elements[1],camera.matrix.elements[2]);

	raycaster.setFromCamera(mouse,camera);

	renderer.render( scene, camera); // render the scene
	requestAnimationFrame( render );

	let velAdd = new THREE.Vector3();
	velAdd.add(new THREE.Vector3(0,-gravity,0))
	
	if(keysDown['w']){
		let mult = -speed;
		if(sprinting){
			mult*=5;
		}
		velAdd.add(camLook.clone().multiplyScalar(mult));
		console.log(keysDown)
	}
	if(keysDown['s']){
		velAdd.add(camLook.clone().multiplyScalar(speed));
	}
	if(keysDown['a']){
		velAdd.add(camRight.clone().multiplyScalar(-speed));
	}
	if(keysDown['d']){
		velAdd.add(camRight.clone().multiplyScalar(speed));
	}

	velAdd.multiplyScalar(delta);
	playerVel.sub(new THREE.Vector3(playerVel.x, 0 ,playerVel.z).multiplyScalar(delta*7));
	playerVel.add(velAdd)

	bboxTest.updateValues();

	let prevPos = bboxTest.position;
	bboxTest.position.add(playerVel.clone().multiplyScalar(delta));
	bboxTest.intersectsBox(ground);
	//ground.
	objs.forEach((object)=>{
		//if(player.position.distanceTo(object.position) <= playerVel){

		//}
		//console.log(object)
		if(bboxTest.intersectsBox(object)){
			//let vA = new THREE.Vector3();
			//let vB = new THREE.Vector3();
			//let vC = new THREE.Vector3();
			//let vD = new THREE.Vector3();


			//to - from
			let gbCenter = object.position.clone();

			raycaster.set(player.position, (gbCenter.sub(player.position).normalize()));
			//console.log(testCaster.intersectObject(ground)[0].face.normal);
			let intersect = raycaster.intersectObject(object)[0];
			let face = intersect.face;
			//console.log(intersect)

			let faceNorm = face.normal;
			faceNorm.transformDirection(object.matrixWorld);
			let proj = playerVel.clone().projectOnPlane(faceNorm);



			//console.log(face);
			playerVel.copy(proj);
			
		}
		
	});

	bboxTest.position.copy(prevPos.add(playerVel.clone().multiplyScalar(delta)));

	player.position.copy(bboxTest.position);
	camera.position.copy(player.position);
};

window.onload = initScene();