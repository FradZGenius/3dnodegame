package com.wordpress.kahshiu.utils 
{
	/**
	 * ...
	 * @author Shiu
	 */
	public class Vector2d
	{
		private var _x:Number, _y:Number;
		
		/**** Class properties ****/
		public function get x():Number {
			return _x;
		}
		
		public function set x(value:Number):void {
			_x = value;
		}
		
		public function get y():Number {
			return _y;
		}
		
		public function set y(value:Number):void {
			_y = value;
		}
		
		public function get magnitude():Number {
			return Math2.Pythagoras(_x, _y);
		}
		
		public function set magnitude(value:Number):void {
			var curr_angle:Number = angle;
			_x = value * Math.cos(curr_angle);
			_y = value * Math.sin(curr_angle);
		}
		
		public function get angle():Number {
			return Math.atan2(_y, _x);
		}
		
		public function set angle(value:Number):void {
			var current_magnitude:Number = magnitude;
			_x = current_magnitude * Math.cos(value);
			_y = current_magnitude * Math.sin(value);
		}
		
		public function get normR():Vector2d {
			return new Vector2d(-1 * this._y, this._x);
		}
		
		public function get normL():Vector2d {
			return new Vector2d(this._y, -1 * this._x);
		}
		
		public function get unitVector():Vector2d {
			return new Vector2d(_x / magnitude, _y / magnitude);
		}
		
		/**** Static functions ****/
		/**
		 * Performs operation A+B
		 * @param	A	Vector2d to add
		 * @param	B	Vector2d
		 * @return	A+B
		 */
		public static function add(A:Vector2d, B:Vector2d):Vector2d {
			return new Vector2d(A.x + B.x, A.x + B.y);
		}
		
		/**
		 * Performs operation A-B
		 * @param	A	Vector2d to minus
		 * @param	B	Vector2d
		 * @return	A-B
		 */
		public static function minus(A:Vector2d, B:Vector2d):Vector2d {
			return new Vector2d(A.x - B.x, A.x - B.y);
		}
		
		public static function rotate(A:Vector2d, angle:Number):Vector2d {
			var B:Vector2d = A.clone();
			B.rotate(angle);
			return B;
		}
		
		/**
		 * Calculate the angle to rotate from vector A to B
		 * @param	A	Vector2d to start rotating
		 * @param	B	Vector2d to end
		 * @return	angle from A to B
		 */
		public static function angleBetween(A:Vector2d, B:Vector2d):Number {
			var A_unitVector:Vector2d = A.unitVector;
			var B_unitVector:Vector2d = B.unitVector;
			return Math.acos(A.dotProduct(B));
		}
		
		/**
		 * Interpolate input vector to value
		 * @param	A	Vector2d to interpolate
		 * @param	value	interpolation value between 0 and 1
		 * @return	new Vector2d interpolated
		 */
		public static function interpolate(A:Vector2d, value:Number):Vector2d {
			
			return new Vector2d(A.x * value, A.y * value);
		}
		
		/**** Class functions ****/
		/**
		 * Constructor of Vector2d
		 * @param	x	horizontal length of vector
		 * @param	y	vertical length of vector
		 */
		public function Vector2d(x:Number, y:Number) {
			this._x = x;
			this._y = y;
		}
		
		/**
		 * Create a copy of current vector
		 * @return Copied vector
		 */
		public function clone ():Vector2d{
			return new Vector2d(this._x, this._y);
		}
		
		/**
		 * Trace current vector for debugging purposes
		 * @param	type 
			* "xy"	[x, y]
			* "ma"	[magnitude, angle]
		 * @return
			* an array of vector values
		 */
		public function trace(type:String):Vector.<Number> {
			var output:Vector.<Number>;
			
			if (type === "xy")		output = new <Number>[this._x, this._y];
			else if (type === "ma")	output = new <Number>[this.magnitude, this.angle];
			
			return output;
		}
		
		/**
		 * Scale current vector
		 * @param	factor
		 * Original is 1, half is 0.5;
		 */
		public function scale (factor:Number):void{
			_x *= factor;
			_y *= factor;
		}
		
		/**
		 * Invert current vector
		 * @param	type
			* input parameters: "x" or "y" or "xy"
			* "x"	invert x only
			* "y"	invert y only
			* "xy"	invert both
		 * 
		 */
		public function invert(type:String):void{
			if (type.charAt(0) == "x") 							this._x *= -1;
			if (type.charAt(0) == "y" || type.charAt(1) == "y") this._y *= -1;
		}
		
		/**
		 * Add current vector by B, self+B
		 * @param	B	to minus B
		 */
		public function add(B:Vector2d):void{
			this._x += B.x;
			this._y += B.y;
		}
		
		/**
		 * Minus current vector by B, self-B
		 * @param	B	to minus B
		 */
		public function minus(B:Vector2d):void{
			this._x -= B.x;
			this._y -= B.y;
		}
		
		/**
		 * Rotate current vector by angle
		 * @param	value	angle in radians
		 */
		public function rotate(value:Number):void{
			_x = _x * Math.cos(value) - _y * Math.sin(value);
			_y = _x * Math.sin(value) + _y * Math.cos(value);
		}
		
		/**
		 * Calculate the dot product between current vector and B
		 * @param	B	Input vector
		 * @return	dot product, a scalar value
		 */
		public function dotProduct(B:Vector2d):Number {
			return _x * B.x + _y * B.y;
		}
		
		/**
		 * Calculate the perpendicular product between current vector and B
		 * @param	B	Input vector
		 * @return	perpendicular product, a scalar value
		 */
		public function perpProduct(B:Vector2d):Number {
			return _y * B.x + _x * -B.y;
		}
		
		/**
		 * Calculate cross product of current vector and input, self x B
		 * @param	B	Input vector
		 * @return
		 */
		public function crossProduct(B:Vector2d):Number {
			return _x * B.y - _y * B.x;
		}
		
		/**
		 * Calculate whether current vector is equivalent to input
		 * @param	B
		 * @return
		 */
		public function equivalent(B:Vector2d):Boolean {
			var diff:Number = Math.pow(4, -10);
			return (_x - B.x < diff && _y - B.y < diff)
		}
	}

}