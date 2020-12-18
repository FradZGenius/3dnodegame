class BoundingBox{
	constructor(object){
		let pos = object.position;
		let params = object.geometry.parameters;

		this.x = pos.x;
		this.y = pos.y;
		this.z = pos.z;
		
		this.width = params.width;
		this.height = params.height;
		this.depth = params.depth;
	}

	intersectsBox(box){
		//Oh boy separating axis theorum
		
		
	}

}