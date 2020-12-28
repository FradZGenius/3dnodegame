var abs = Math.abs;

class BoundingBox{
	constructor(object){
		let params = object.geometry.parameters;
	
		this.object = object;

		this.position = object.position;

		//get matrix of mesh to do stuff
		let normMat = object.matrix.elements;
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

		/*let normMat = this.object.normalMatrix
		this.right = new THREE.Vector3(normMat[0],normMat[1],normMat[2]);
		this.up = new THREE.Vector3(normMat[3],normMat[4],normMat[5]);
		this.look = new THREE.Vector3(normMat[6],normMat[7],normMat[8]);
		console.log(this.right);*/

		this.width = params.width;
		this.height = params.height;
		this.depth = params.depth;
	}

	intersectsBox(box){
		//Oh boy separating axis theorum
		//console.log(box);
		let boxNorms = box.matrix.elements;
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
		
		let unit = [this.right,this.up,this.look,bx,by,bz];
		let last3 = 0
		let axes = 0;

		for(let i = 0; i < 15; i++){
			//loop runs 15 times, only need to make it pick which axis to check collisions on
			if(i < 6){
				l = unit[i].clone();
			}else{
				if(i%3 == 0){
					last3 = i;		
				}
				let a = unit[(last3 - 6)/3].clone()
				//console.log((last3 - 6)/3);
				let b = unit[(i-last3) + 3].clone()
				l = new THREE.Vector3();
				l.crossVectors(a,b);
			}

			if(abs(t.dot(l)) > abs(this.right.clone().multiplyScalar(this.width/2).dot(l)) + abs(this.up.clone().multiplyScalar(this.height/2).dot(l)) + abs(this.look.clone().multiplyScalar(this.depth/2).dot(l)) + 
			abs(bx.clone().multiplyScalar(bw).dot(l)) + abs(by.clone().multiplyScalar(bh).dot(l)) + abs(bz.clone().multiplyScalar(bd).dot(l)))
			{
				return false;	
			}
			
		}
		//console.log('collision', t.dot(this.up));
		return true;
		

	}
//|Proj ( T )| > |Proj ( WA*Ax )| + |Proj ( HA*Ay )| + |Proj( DA*Az )|
//+ |Proj ( WB*Bx )| + |Proj( HB*By )| + |Proj( DB*Bz )|

//15 total cases, L represents the axis
/*
L = Ax
L = Ay
L = Az
L = Bx
L = By
L = Bz
L = Ax X Bx
L = Ax X By
L = Ax X Bz
L = Ay X Bx
L = Ay X By
L = Ay X Bz
L = Az X Bx
L = Az X By
L = Az X Bz

The separating plane spans the axes, the axis is 
perpendicular to the plane, so you can just cross
the two axes to get the separating axis.

B must be a unit vector in order for the dot product
to be equal to the magnitude projection
*/
}
