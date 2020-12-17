Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';


var initScene, render, renderer, scene, camera, box, raycaster, canvas;

var mouse = new THREE.Vector2();

var socket = io();

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


initScene = function() {
	raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
	canvas = renderer.domElement;
    document.body.appendChild( renderer.domElement );
	canvas.addEventListener('mousemove',function(evnt){
		mouse = new THREE.Vector2(evnt.offsetX, evnt.offsetY)
	});

    scene = new Physijs.Scene;
    
    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set( 60, 50, 60 );
    camera.lookAt( scene.position );
    scene.add( camera );
    
    // Box
    box = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 5, 5, 5 ),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    scene.add( box );
    
    requestAnimationFrame( render );
};

//leading bounding box that extends in direction
//of player's velocity, detects collisions
//raycast from player to collision to see what face
//take other 2 vectors that are not equal
//to the normal of the face to 

render = function() {
	let camLook = new THREE.Vector3(camera.matrix.elements[8],camera.matrix.elements[9],camera.matrix.elements[10]);
	raycaster.setFromCamera(mouse,camera);
	if(raycaster.intersectObjects(scene.children)[0]){
		socket.emit('debug',raycaster.intersectObjects(scene.children))
		
	}

    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};

window.onload = initScene();