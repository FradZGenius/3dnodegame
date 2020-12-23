class BoundingBox{
	constructor(object){
		let pos = object.position;
		let params = object.geometry.parameters;
	
		this.x = pos.x;
		this.y = pos.y;
		this.z = pos.z;
		
		//get matrix of mesh to do stuff
		let normMat = object.normalMatrix
		this.right = new THREE.Vector3(normMat[0],normMat[1],normMat[2]);
		this.up = new THREE.Vector3(normMat[3],normMat[4],normMat[5]);
		this.look = new THREE.Vector3(normMat[6],normMat[7],normMat[8]);

		this.width = params.width;
		this.height = params.height;
		this.depth = params.depth;
	}

	intersectsBox(box){
		//Oh boy separating axis theorum
		let boxNorms = box.normalMatrix;
		let bx = new THREE.Vector3(boxNorms[0],boxNorms[1],boxNorms[2]);
		let by = new THREE.Vector3(boxNorms[3],boxNorms[4],boxNorms[5]);
		let bz = new THREE.Vector3(boxNorms[6],boxNorms[7],boxNorms[8]);

		let bparams = box.geometry.parameters;

		let bw = bparams.width;
		let bh = bparams.height;
		let bd = bparams.depth;

		let l = this.right;
		let t = box.position.sub(this.position);
		
		let aUnit = [this.right,this.up,this.look];
		let bUnit = [bx,by,bz];

		for(i = 0; i>(aUnit.length + bUnit.length) + (aUnit.length * bUnit.length); i++){

			//loop runs 15 times, only need to make it pick which axis to check collisions on

			

			if(t.dot(l) > (this.right.multiplyScalar(this.width).dot(l)) + this.up.multiplyScalar(this.width).dot(l) + this.look.multiplyScalar(this.depth).dot(l) + 
			bx.multiplyScalar(bw).dot(l) + by.multiplyScalar(bh).dot(l) + bz.multiplyScalar(bd).dot(l))
			{
				//collision on axis L	
			}
		}

		

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
