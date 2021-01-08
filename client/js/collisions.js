var noOp = function(a){return a;};

var abs = Math.abs;

isNegative = function(v){
	let a = v.x+v.y+v.z;
	return (a>=0) ? false : true;
}

makePositive = function(v){
	return new THREE.Vector3(Math.abs(v.x),Math.abs(v.y),Math.abs(v.z)).normalize();
}

class BoundingBox{
	constructor(object){
		let params = object.geometry.parameters;
	
		this.object = object;

		this.position = object.position;

		//get matrix of mesh to do stuff
		let normMat = object.matrixWorld.elements;
		this.right = new THREE.Vector3(normMat[0],normMat[1],normMat[2]);
		this.up = new THREE.Vector3(normMat[4],normMat[5],normMat[6]);
		this.look = new THREE.Vector3(normMat[8],normMat[9],normMat[10]);

		this.width = params.width;
		this.height = params.height;
		this.depth = params.depth;

	}

	updateValues(){
		let params = this.object.geometry.parameters;
	
		this.position = this.object.position;

		let normMat = this.object.matrixWorld.elements;
		this.right = new THREE.Vector3(normMat[0],normMat[1],normMat[2]);
		this.up = new THREE.Vector3(normMat[4],normMat[5],normMat[6]);
		this.look = new THREE.Vector3(normMat[8],normMat[9],normMat[10]);

		this.width = params.width;
		this.height = params.height;
		this.depth = params.depth;
	}

	intersectsBox(box){
		//Oh boy separating axis theorum
		let boxNorms = box.matrixWorld.elements;
		let bx = new THREE.Vector3(boxNorms[0],boxNorms[1],boxNorms[2]);
		let by = new THREE.Vector3(boxNorms[4],boxNorms[5],boxNorms[6]);
		//console.log(this.object.matrix.elements)
		let bz = new THREE.Vector3(boxNorms[8],boxNorms[9],boxNorms[10]);

		let bparams = box.geometry.parameters;

		let bw = bparams.width/2;
		let bh = bparams.height/2;
		let bd = bparams.depth/2;

		let l = this.right.clone();
		let t = box.position.clone().sub(this.position);
		
		let unit = [
			this.right,
			this.up,
			this.look,
			bx,
			by,
			bz,
			this.right.clone().cross(bx).normalize(),
			this.right.clone().cross(by).normalize(),
			this.right.clone().cross(bz).normalize(),
			this.up.clone().cross(bx).normalize(),
			this.up.clone().cross(by).normalize(),
			this.up.clone().cross(bz).normalize(),
			this.look.clone().cross(bx).normalize(),
			this.look.clone().cross(by).normalize(),
			this.look.clone().cross(bz).normalize(),
		];
		let last3 = 0
		let mtvs = [];
		//console.log(unit, box.name)
		//if(box.name == 'ground') socket.emit('debug',unit[1]);
		for(let i = 0; i < unit.length; i++){
			//loop runs 15 times, only need to make it pick which axis to check collisions on
			/*if(i < 6){
				l = unit[i].clone();
			}else{
				if(i%3 == 0){
					last3 = i;		
				}
				let a = unit[(last3 - 6)/3].clone()
				//console.log((last3 - 6)/3);
				let b = unit[(i-last3) + 3].clone()
				if(a.normalize().equals(b.normalize())){
					l = new THREE.Vector3();
					l.crossVectors(a,b).normalize();
					break;
				}
				l = a;
			}*/
			l = unit[i].clone();
			console.log(this.right)
			//if(box.name == 'ground') console.log(l, i);
			let dist = t.clone().dot(l);
			let axes = abs(this.right.clone().multiplyScalar(this.width/2).dot(l)) + abs(this.up.clone().multiplyScalar(this.height/2).dot(l)) + abs(this.look.clone().multiplyScalar(this.depth/2).dot(l)) + 
			abs(bx.clone().multiplyScalar(bw).dot(l)) + abs(by.clone().multiplyScalar(bh).dot(l)) + abs(bz.clone().multiplyScalar(bd).dot(l));
			//if(box.name == 'ground') socket.emit('debug', l);
			if(abs(dist) > axes)
			{
				return false;	
			}else{
				let overlap = (dist < 0) ? axes + dist : dist - axes;
				//let overlap = (dist < 0) ?  axes + dist : axes - dist;
				//if(i==4) console.log(dist);
				mtvs.push(l.multiplyScalar(overlap))
			}
			
			
		}
		let mtv = mtvs[0];
		for(let i = 1; i<mtvs.length-1;i++){
			if(mtvs[i].lengthSq()<mtv.lengthSq()) {
				mtv = mtvs[i];
			}
		}
		//socket.emit('debug',unit)
		return {mtv: mtv, axis: mtv.clone().normalize()};
		

	}
}
