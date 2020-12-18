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
    
    player.position.set(0,30,0);

    playerBox.setFromObject(player);

    //scene.add( playerBox );
    ground = new THREE.Mesh(
        new THREE.BoxGeometry(50,5,50),
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

    playerVel.add(new THREE.Vector3(.0005,-.001,0))

    let prevMin = playerBox.min.clone();


    playerBox.min.add(playerVel);

    let prevMax = playerBox.max.clone();
    playerBox.max.add(playerVel);
        
    if(playerBox.intersectsBox(groundBox)){
        let testCaster = new THREE.Raycaster();
        //to - from
        let gbCenter = new THREE.Vector3();
        groundBox.getCenter(gbCenter);

        testCaster.set(player.position, (gbCenter.sub(player.position).normalize()));
        //console.log(testCaster.intersectObject(ground)[0].face.normal);
        let face = testCaster.intersectObject(ground)[0].face;
        let proj = playerVel.projectOnPlane(face.normal);

        playerBox.min.copy(prevMin.add(playerVel));
        playerBox.max.copy(prevMax.add(playerVel));
    }
    let b = new THREE.Vector3();
    playerBox.getCenter(b);
    player.position.copy(b);
    
};

window.onload = initScene();