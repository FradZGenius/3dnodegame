const scene = new THREE.Scene();
const clock = new THREE.Clock();
const PI = Math.PI;

const RAD = function (deg) {
	return deg * PI / 180;
}

const DEG = function (rad) {
	return rad * 180 / PI;
}
//    <link href="style.css" rel="stylesheet" type="text/css" />

var keysDown = {};

const KEYS = {
	W: 87,
	S: 83,
	A: 65,
	D: 68,
};

// The camera
const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	.01,
	10000
);

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000000, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);

const canvas = renderer.domElement;
// A cube we are going to animate

const speed = 5;
// Make the camera further from the cube so we can see it better
camera.position.z = 5;
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

//collisions testing
function render(bruh) {
	var velocity = new THREE.Vector3();
	const delta = clock.getDelta();
	var euler = new THREE.Euler(0, 0, 0,'YXZ');
	// Render the scene and the camera
	renderer.render(scene, camera);
	const lookAt = new THREE.Vector3(camera.matrix.elements[8], 0, camera.matrix.elements[10]);
	lookAt.normalize();
	const rightVector = new THREE.Vector3(camera.matrix.elements[0], 0, camera.matrix.elements[2]);
	rightVector.normalize();
	
	let camPos = new THREE.Vector3();
	
	// Rotate the cube every frame
	if (keysDown[KEYS.W]) {
		velocity.add(lookAt.multiplyScalar(-delta * speed));
	}
	if (keysDown[KEYS.S]) {
		velocity.add(lookAt.multiplyScalar(delta * speed));
	}
	if (keysDown[KEYS.A]) {
		velocity.add(rightVector.multiplyScalar(-delta * speed));
	}
	if (keysDown[KEYS.D]) {
		velocity.add(rightVector.multiplyScalar(delta * speed));
	}
	requestAnimationFrame(render);
}
//87 = w
//83 = s
//65 = a
//68 = d
addEventListener('keydown', function (e) {
	keysDown[e.keyCode] = true;
});

addEventListener('keyup', function (e) {
	delete keysDown[e.keyCode];
});

addEventListener('mousedown', () =>{
	canvas.requestPointerLock();
});


var euler = new THREE.Euler(0,0,0,'YXZ');
addEventListener('mousemove',(mouse)=>{
	if(document.pointerLockElement) {
		euler.y -= RAD(mouse.movementX) / 5;
		euler.x -= RAD(mouse.movementY) / 5;

		camera.quaternion.setFromEuler(euler);
	}
});

render();