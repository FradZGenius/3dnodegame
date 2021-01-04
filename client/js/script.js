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

var dragging = false;

onMouseDown = function(evnt){
	if(evnt.button == 2){
		dragging = true;
	}
}

onMouseUp = function(evnt){
	if(evnt.button == 2){
		dragging = false;
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
			new THREE.MeshToonMaterial({ color: 0xff0000 })
	);
	scene.add( player );
	
	player.position.set(0,60,0);

	bboxTest = new BoundingBox(player);

	//socket.emit('debug',bboxTest.depth)


	ground = new THREE.Mesh(
			new THREE.BoxBufferGeometry(500,5,50),
			new THREE.MeshToonMaterial({ color: 0x00ff00 })
	);
	ground.name = "ground";
	//ground.visible = false;
	scene.add(ground);

	groundBox.setFromObject(ground);
	ground.position.set(0,0,0)
	ground.rotation.set(rad(45),0,0)
	
	
	testBox2 = new THREE.Mesh(
		new THREE.BoxBufferGeometry(10,10,10),
		new THREE.MeshToonMaterial({color: 0xff00ff})
	)
	
	testBox2.name = 'Box2';

	scene.add(testBox2);
	testBox2.position.set(-100,0,0)
	testBox2.rotation.set(0,0,rad(-45))
	let light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
	scene.add(light)
	requestAnimationFrame( render );
	let light2 = new THREE.PointLight(0xffffff, 1,50)
	light2.position.set(0,40,0);
	scene.add(light2)
	objs.push(ground, testBox2)
};

//leading bounding box that extends in direction
//of player's velocity, detects collisions
//raycast from player to collision to see what face
//take other 2 vectors that are not equal
//to the normal of the face to 

document.addEventListener('keydown',onKeydown);
document.addEventListener('keyup',onKeyUp);

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);

render = function() {
	//controls.lock();
	//camera.lookAt( player.position );
	//ground.rotation.set(ground.rotation.x + rad(.05), ground.rotation.y,ground.rotation.z)
	let delta = clock.getDelta();
	let camLook = new THREE.Vector3(camera.matrix.elements[8],0,camera.matrix.elements[10]).normalize();
	let camRight = new THREE.Vector3(camera.matrix.elements[0],camera.matrix.elements[1],camera.matrix.elements[2]);
	if(!dragging) player.rotation.set(0,camera.rotation.y,0);

	let playerMat = player.matrix.elements;
	let playerLook = new THREE.Vector3(playerMat[8], 0, playerMat[10]);
	let playerRight = new THREE.Vector3(playerMat[0],playerMat[1],playerMat[2]);

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
		velAdd.add(playerLook.clone().multiplyScalar(mult));
	}
	if(keysDown['s']){
		velAdd.add(playerLook.clone().multiplyScalar(speed));
	}
	if(keysDown['a']){
		velAdd.add(playerRight.clone().multiplyScalar(-speed));
	}
	if(keysDown['d']){
		velAdd.add(playerRight.clone().multiplyScalar(speed));
	}

	velAdd.multiplyScalar(delta);
	playerVel.sub(new THREE.Vector3(playerVel.x, 0 ,playerVel.z).multiplyScalar(delta*7));
	playerVel.add(velAdd)

	bboxTest.updateValues();

	//let prevPos = bboxTest.position.clone();
	bboxTest.position.add(playerVel.clone().multiplyScalar(delta));
	let push = new THREE.Vector3();
	objs.forEach((object)=>{
		let collisionInfo = bboxTest.intersectsBox(object);
		if(collisionInfo){


			//to - from
			let gbCenter = object.position.clone();

			raycaster.set(player.position, (gbCenter.sub(player.position).normalize()));
			let intersect = raycaster.intersectObject(object)[0];
			let face = intersect.face;

			let faceNorm = face.normal;
			faceNorm.transformDirection(object.matrixWorld);
			let proj = playerVel.clone().projectOnPlane(collisionInfo.axis);
			console.log(collisionInfo.axis)
			push.add(collisionInfo.mtv);
			//console.log(collisionInfo.mtv)
			//bboxTest.position.add(collisionInfo.mtv)
			playerVel.copy(proj);			
		}
		
	});

	//bboxTest.position.copy(prevPos.add(playerVel.clone().multiplyScalar(delta).add(push)));
	bboxTest.position.add(push)
	player.position.copy(bboxTest.position);
	camera.position.copy(player.position.clone().sub(camLook.clone().multiplyScalar(-20)));

};

window.onload = initScene();