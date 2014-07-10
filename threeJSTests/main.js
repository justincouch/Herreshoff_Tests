var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 80 );
camera.position.z = 3;
//camera.position.x = 0.5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );


var mat1 = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, wireframeLinewidth: 0.1 } );
var mat2 = new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );

var tetra = [];
tetra[0] = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true, wireframeLinewidth: 0.1  } );
tetra[1] = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, wireframeLinewidth: 0.1  } );
tetra[2] = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, wireframeLinewidth: 0.1  } );
tetra[3] = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, wireframeLinewidth: 0.1  } );
var tetracounter = 0;
var geometry = new THREE.Geometry();

var numPoints = 4;

for ( var i=0; i<numPoints; i++ ){
	var pos = new THREE.Vector3( Math.random(), Math.random(), Math.random() );
	geometry.vertices.push( pos );
	var dot = new THREE.Mesh( new THREE.SphereGeometry( 0.05,8,8 ), mat1 );
	dot.position = pos;
	scene.add( dot );
}

//var c4 = circumsphere( geometry.vertices[0], geometry.vertices[1], geometry.vertices[2], geometry.vertices[3] );
var c1 = circumsphere( geometry.vertices[0], geometry.vertices[1], geometry.vertices[2], geometry.vertices[3] );
// var c2 = circumsphere( geometry.vertices[1], geometry.vertices[2], geometry.vertices[3], geometry.vertices[0] );
// var c3 = circumsphere( geometry.vertices[2], geometry.vertices[3], geometry.vertices[0], geometry.vertices[1] );
// var c4 = circumsphere( geometry.vertices[3], geometry.vertices[0], geometry.vertices[1], geometry.vertices[2] );
scene.add( c1 );
// scene.add( c2 );
// scene.add( c3 );
// scene.add( c4 );

var corners = new THREE.Geometry();
corners.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
corners.vertices.push( new THREE.Vector3( 1, 0, 0 ) );
corners.vertices.push( new THREE.Vector3( 0, 1, 0 ) );
corners.vertices.push( new THREE.Vector3( 0, 0, 1 ) );
corners.vertices.push( new THREE.Vector3( 1, 1, 0 ) );
corners.vertices.push( new THREE.Vector3( 1, 0, 1 ) );
corners.vertices.push( new THREE.Vector3( 0, 1, 1 ) );
corners.vertices.push( new THREE.Vector3( 1, 1, 1 ) );

// var cornerTest = circumsphere( corners.vertices[0], corners.vertices[1], corners.vertices[2], corners.vertices[5] );
// scene.add( cornerTest );

geometry.faces.push( new THREE.Face3(0,1,2) );
geometry.faces.push( new THREE.Face3(1,2,3) );
geometry.faces.push( new THREE.Face3(3,0,1) );
geometry.faces.push( new THREE.Face3(2,3,0) );

var shape = new THREE.Mesh( geometry, mat2 );
scene.add( shape );

var boundBox = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), mat1 );
boundBox.position = new THREE.Vector3( 0.5, 0.5, 0.5 );
scene.add( boundBox );


function circumsphere( v1, v2, v3, v4 ){
	console.log( v1 );
	console.log( v2 );
	console.log( v3 );
	console.log( v4 );

	var a = 0;
	var Dx = 0;
	var Dy = 0;
	var Dz = 0;
	var c = 0;

	var x1sqrd = v1.x*v1.x;
	var x2sqrd = v2.x*v2.x;
	var x3sqrd = v3.x*v3.x;
	var x4sqrd = v4.x*v4.x;
	var y1sqrd = v1.y*v1.y;
	var y2sqrd = v2.y*v2.y;
	var y3sqrd = v3.y*v3.y;
	var y4sqrd = v4.y*v4.y;
	var z1sqrd = v1.z*v1.z;
	var z2sqrd = v2.z*v2.z;
	var z3sqrd = v3.z*v3.z;
	var z4sqrd = v4.z*v4.z;

	var v1sqrd = x1sqrd + y1sqrd + z1sqrd;
	var v2sqrd = x2sqrd + y2sqrd + z2sqrd;
	var v3sqrd = x3sqrd + y3sqrd + z3sqrd;
	var v4sqrd = x4sqrd + y4sqrd + z4sqrd;

	console.log( "v1sqrd: " + v1sqrd );
	console.log( "v2sqrd: " + v2sqrd );
	console.log( "v3sqrd: " + v3sqrd );
	console.log( "v4sqrd: " + v4sqrd );

	// var t = [
	// 	[ v1.x, v1.y, v1.z, 1 ],
	// 	[ v2.x, v2.y, v2.z, 1 ],
	// 	[ v3.x, v3.y, v3.z, 1 ],
	// 	[ v4.x, v4.y, v4.z, 1 ]
	// 	];
	// 	console.log( t );

	// a = determinant( a, [
	// 	[ v1.x, v1.y, v1.z, 1 ],
	// 	[ v2.x, v2.y, v2.z, 1 ],
	// 	[ v3.x, v3.y, v3.z, 1 ],
	// 	[ v4.x, v4.y, v4.z, 1 ]
	// 	]);
	
	// Dx = determinant( Dx, [
	// 	[ v1sqrd, v1.y, v1.z, 1 ],
	// 	[ v2sqrd, v2.y, v2.z, 1 ],
	// 	[ v3sqrd, v3.y, v3.z, 1 ],
	// 	[ v4sqrd, v4.y, v4.z, 1 ]
	// 	]);

	// Dy = determinant( Dy, [
	// 	[ v1sqrd, v1.x, v1.z, 1 ],
	// 	[ v2sqrd, v2.x, v2.z, 1 ],
	// 	[ v3sqrd, v3.x, v3.z, 1 ],
	// 	[ v4sqrd, v4.x, v4.z, 1 ]
	// 	]);

	// Dz = determinant( Dz, [
	// 	[ v1sqrd, v1.x, v1.y, 1 ],
	// 	[ v2sqrd, v2.x, v2.y, 1 ],
	// 	[ v3sqrd, v3.x, v3.y, 1 ],
	// 	[ v4sqrd, v4.x, v4.y, 1 ]
	// 	]);

	// c = determinant( c, [
	// 	[ v1sqrd, v1.x, v1.y, v1.z ],
	// 	[ v2sqrd, v2.x, v2.y, v2.z ],
	// 	[ v3sqrd, v3.x, v3.y, v3.z ],
	// 	[ v4sqrd, v4.x, v4.y, v4.z ]
	// 	]);

	var aM4 = new THREE.Matrix4( 	v1.x, v1.y, v1.z, 1,
									v2.x, v2.y, v2.z, 1,
									v3.x, v3.y, v3.z, 1,
									v4.x, v4.y, v4.z, 1 );

	var DxM4 = new THREE.Matrix4( 	v1sqrd, v1.y, v1.z, 1, 
									v2sqrd, v2.y, v2.z, 1,
									v3sqrd, v3.y, v3.z, 1,
									v4sqrd, v4.y, v4.z, 1 );

	var DyM4 = new THREE.Matrix4( 	v1sqrd, v1.x, v1.z, 1, 
									v2sqrd, v2.x, v2.z, 1,
									v3sqrd, v3.x, v3.z, 1,
									v4sqrd, v4.x, v4.z, 1 );

	var DzM4 = new THREE.Matrix4( 	v1sqrd, v1.x, v1.y, 1, 
									v2sqrd, v2.x, v2.y, 1,
									v3sqrd, v3.x, v3.y, 1,
									v4sqrd, v4.x, v4.y, 1 );

	var cM4 = new THREE.Matrix4( 	v1sqrd, v1.x, v1.y, v1.z, 
									v2sqrd, v2.x, v2.y, v2.z,
									v3sqrd, v3.x, v3.y, v3.z,
									v4sqrd, v4.x, v4.y, v4.z );

	var a = aM4.determinant();
	var Dx = DxM4.determinant();
	var Dy = -1*DyM4.determinant();
	var Dz = DzM4.determinant();
	var c = cM4.determinant();

	console.log( "a: " + a );
	console.log( "Dx: " + Dx );
	console.log( "Dy: " + Dy );
	console.log( "Dz: " + Dz );
	console.log( "c: " + c );



	var x0 = Dx / (2*a);
	var y0 = Dy / (2*a);
	var z0 = Dz / (2*a);

	var r = ( Math.sqrt( Dx*Dx + Dy*Dy + Dz*Dz - 4*a*c ) )/( 2*Math.abs(a) );
	console.log( "cc: " + x0 + ", " + y0 + ", " + z0 );
	console.log( "r: " + r );
	//console.log( tetracounter );
	//var cs = new THREE.Mesh( new THREE.SphereGeometry( r,32,32 ), tetra[tetracounter] );
	var cs = new THREE.Mesh( new THREE.SphereGeometry( r,32,32 ), mat1 );
	//var cs = new THREE.SphereGeometry( r,8,8 );
	cs.position.x = x0;
	cs.position.y = y0;
	cs.position.z = z0;
	tetracounter++;
	return cs; 
}

function determinant( D, A ){
	// console.log( "starting determinant of ");
	// console.log( A );
	// console.log( "A.length: " + A.length );
	if ( A.length > 2 ){
		for ( i in A ){
			var a = [];
			var acounter = 0;
			for ( var ii=0; ii<A.length; ii++ ){
				if ( ii != i ){
					a[acounter] = [];
					for ( var jj=1; jj<A.length; jj++ ){
						a[acounter].push( A[jj][ii] );
					}
					acounter++;
				}
			}
			var det = determinant( D, a );
			var flip = ( i%2==0 ? 1 : -1 );
			// console.log( det );
			// console.log( i + " : " + flip);
			// console.log( A[0][i] );
			D += flip * A[0][i] * det;
			//console.log( "D: " + D );
		}
		return D;
	}
	else {
		D = ( A[0][0] * A[1][1] ) - ( A[0][1] * A[1][0] );
		// console.log( "determinant of " );
		// console.log( A );
		// console.log( " = " + D );
		return D;
	}
	
}


function render() {
	requestAnimationFrame( render );

	renderer.render( scene, camera );
}
render();

var testM4 = new THREE.Matrix4( 0, 0, 0, 1,
								1, 0, 0, 1,
								0, 1, 0, 1,
								0, 0, 1, 1 );
var test = testM4.determinant();
// test = determinant( test, [
// 	[ 0, 0, 0, 1 ],
// 	[ 1, 0, 0, 1 ],
// 	[ 0, 1, 0, 1 ],
// 	[ 0, 0, 1, 1 ]
// 	]);
console.log ( "test: " + test );
console.log( scene );
//circumsphere( 1, 2, 3, 4 );