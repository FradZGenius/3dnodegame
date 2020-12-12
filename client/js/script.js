/*function genMap() {
	let wall = {
		geometry: new THREE.BoxGeometry(WALL_SIZE, 1, WALL_SIZE),
		material: new THREE.MeshBasicMaterial({
			color: 0xFF0000
		})
	}
	for(let i = 0; i < MAP.length; i++) {
		for(let j = 0; j < MAP[i].length; j++) {
			if(MAP[i][j] != 1) continue;
			let mesh = new THREE.Mesh(wall.geometry, wall.material);
			mesh.position.x = i * WALL_SIZE;
			mesh.position.z = j * WALL_SIZE;
			scene.add(mesh);
			let bbox = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
			bbox.setFromObject(mesh);
			staticObjects.push({
				mesh: mesh,
				boundingBox: bbox
			});
		}
	}
}*/