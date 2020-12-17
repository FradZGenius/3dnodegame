Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';


var initScene, render, renderer, scene, camera, box, raycaster, canvas;

var mouse = new THREE.Vector2();

var socket = io();

var playerBox = new THREE.Box3();

var playerVel = new THREE.Vector3();

var ground;
var groundBox = new THREE.Box3();

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
    camera.position.set( 60, 50, 60 );
    camera.lookAt( scene.position );
    scene.add( camera );
    
    // Box
    player = new THREE.Mesh(
        new THREE.CubeGeometry( 10, 10, 10 ),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add( player );
    
    playerBox.setFromObject(player);

    //scene.add( playerBox );
    ground = new THREE.Mesh(
        new THREE.BoxGeometry(100,5,100),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    scene.add(ground);

    groundBox.setFromObject(ground);

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
	let camLook = new THREE.Vector3(camera.matrix.elements[8],camera.matrix.elements[9],camera.matrix.elements[10]);
	raycaster.setFromCamera(mouse,camera);
	if(raycaster.intersectObjects(scene.children)[0]){
		//socket.emit('debug',raycaster.intersectObjects(scene.children))
	}

    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
    playerVel.add(new THREE.Vector3(0,.001,0))
    playerBox.min.add(playerVel);
    playerBox.max.add(playerVel);
    //console.log(playerVel);
    if(playerBox.intersectsBox(groundBox)){
        console.log('hit');
    }
};

window.onload = initScene();