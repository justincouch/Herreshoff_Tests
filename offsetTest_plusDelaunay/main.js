var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 80 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var hullGeometry = new THREE.Geometry();
var hullGeometryMirror = new THREE.Geometry();
var hullConvexGeometry;
var hullConvex;
var hullPoints = [];
var hull;
var hullMirror;
var hull2;
var hullMirror2;

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
//var hullmaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var hullmaterial = new THREE.MeshDepthMaterial( );
//hullmaterial.side = THREE.DoubleSide;
hullmaterial.wireframe = true;
hullmaterial.wireframeLinewidth = 1;
hullmaterial.transparent = true;
hullmaterial.opacity = 0.5;
var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 20;

var delaunay;

var controls = new THREE.OrbitControls( camera, renderer.domElement );

var waterLineSpacing = 12/12; // in incehs
var stationSpacing = 3.08; // in feet, 3'1"
var buttSpacing = 18/12; // in inches
var baseLineToDWL = 6; // in feet
var DWLz = 3;

var offsets;
$.getJSON( "seaWitchOffsets.json", function( data ) {
	console.log( data );
	offsets = data;
	console.log( offsets );

	var numStations = offsets.offsets.stations.length;
	var numWL = 7;
	console.log( numWL );
	// push to vertices
	
	for ( i in offsets.offsets.stations ){
		//console.log( offsets.offsets.stations[i] );
		var zcounter = 0;
		// HALF BREADTHS
		for ( j in offsets.offsets.half_breadths ){
			console.log( j );

			if ( offsets.offsets.half_breadths[j][i] === "null" ){
				hullGeometry.vertices.push( new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, 0 ) );
				hullGeometryMirror.vertices.push( new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, 0 ) );
			}
			else {
				var a = offsets.offsets.half_breadths[j][i].split( "-" );
				console.log( a );
				var m = 0;
				for ( am in a ){
					console.log( parseFloat(a[am]) );
					if ( am == 0 ) 			m += parseFloat( a[am] ); 			// feet
					else if ( am == 1 ) 	m += parseFloat( a[am] ) / 12; 		// inches
					else if ( am == 2 )		m += parseFloat( a[am] ) / 12 / 8;  // eighths
				}
				hullGeometry.vertices.push( new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, m ) );
				hullGeometryMirror.vertices.push( new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, -1*m ) );
				var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 8, 8 ), new THREE.MeshBasicMaterial( ( (j=="DWL 4") ? {color: 0xff0000} : {color: 0xffff00} ) ) );
				sphere.position = new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, m );
				scene.add( sphere );

				var sphere2 = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 8, 8 ), new THREE.MeshBasicMaterial( ( (j=="DWL 4") ? {color: 0xff0000} : {color: 0xffff00} ) ) );
				sphere2.position = new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, -m );
				scene.add( sphere2 );

				hullPoints.push( new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, m ) );
				hullPoints.push( new THREE.Vector3( i*stationSpacing, zcounter*waterLineSpacing, -m ) );
				//console.log( m );
			}
			zcounter++;
		}
	}
	console.log( hullGeometry.vertices );
	console.log( hullGeometry.vertices[6] );
	// HEIGHTS ABOVE BASELINE
	for ( i in offsets.offsets.stations ){
		var ycounter = 0;
		
		for ( j in offsets.offsets.heights_above_baseline ){
			console.log( j );
			if ( offsets.offsets.heights_above_baseline[j][i] === "null" ){

			}
			else {
				var a = offsets.offsets.heights_above_baseline[j][i].split( "-" );
				console.log( a );
				var m = 0;
				for ( am in a ){
					console.log( parseFloat(a[am]) );
					if ( am == 0 ) 			m += parseFloat( a[am] ); 			// feet
					else if ( am == 1 ) 	m += parseFloat( a[am] ) / 12; 		// inches
					else if ( am == 2 )		m += parseFloat( a[am] ) / 12 / 8;  // eighths
				}

				var z;
				if ( j=="Sheer" ){
					z = hullGeometry.vertices[(i*numWL)+(numWL-1)].z;
				}
				else if ( j == "Rabbet" ){
					z = 0.2;
				}
				else if ( j == "Keel" ){
					z = 0.1;
				}
				else {
					z = ycounter*buttSpacing;
				}
				var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 8, 8 ), new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
				sphere.position = new THREE.Vector3( i*stationSpacing, m + DWLz - baseLineToDWL, z );
				scene.add( sphere );

				var sphere2 = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 8, 8 ), new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
				sphere2.position = new THREE.Vector3( i*stationSpacing, m + DWLz - baseLineToDWL, -z );
				scene.add( sphere2 );

				hullPoints.push( new THREE.Vector3( i*stationSpacing, m + DWLz - baseLineToDWL, z ) );
				hullPoints.push( new THREE.Vector3( i*stationSpacing, m + DWLz - baseLineToDWL, -z ) );
			}
			ycounter++;
		}
	}
	hullConvexGeometry = new THREE.ConvexGeometry( hullPoints );
	hullConvex = new THREE.Mesh ( hullConvexGeometry, hullmaterial );
	scene.add( hullConvex );
	//console.log( hullPoints );
	//console.log( hullGeometry.vertices );
	// make faces from the vertices

	//var del = Delaunay.triangulate( hullPoints );
	//console.log( del );

	//var myDel = tri3d( hullPoints );
	//console.log( myDel );
	
	for ( var i=0; i<numStations-1; i++ ){
		for ( var j=0; j<numWL-1; j++ ){
			hullGeometry.faces.push( new THREE.Face3( i*numWL + j, 		(i*numWL)+ j+1, 		(i+1)*numWL + j ) );
			hullGeometry.faces.push( new THREE.Face3( (i*numWL)+ j+1,   ((i+1)*numWL)+j+1, 		(i+1)*numWL + j) );
			hullGeometryMirror.faces.push( new THREE.Face3( i*numWL + j, 		(i*numWL)+ j+1, 		(i+1)*numWL + j ) );
			hullGeometryMirror.faces.push( new THREE.Face3( (i*numWL)+ j+1,   ((i+1)*numWL)+j+1, 		(i+1)*numWL + j) );
		}
	}
	hull = new THREE.Mesh( hullGeometry, hullmaterial );
	//hull2 = new THREE.Mesh( hullGeometry, hullmaterial2 );
	hullMirror = new THREE.Mesh( hullGeometryMirror, hullmaterial );
	//hullMirror2 = new THREE.Mesh( hullGeometryMirror, hullmaterial2 );
	//console.log( hull );
	//scene.add( hull );
	//scene.add( hullMirror );
	//scene.add( hull2 );
	//scene.add( hullMirror2 );

	var light = new THREE.PointLight( 0xffaaaa );
	light.position.set( -100, 100, 100 );
	scene.add( light );

	var light2 = new THREE.PointLight( 0xaaaaff );
	light2.position.set( 100, -100, 100 );
	scene.add( light2 );

	camera.lookAt( hullGeometry.vertices[10] );
	

	//var t1 = new Tetrahedron( hullPoints[Math.floor( Math.random()*hullPoints.length )], hullPoints[Math.floor( Math.random()*hullPoints.length )], hullPoints[Math.floor( Math.random()*hullPoints.length )], hullPoints[Math.floor( Math.random()*hullPoints.length )] );
	//var t1 = new Tetrahedron( hullPoints[0], hullPoints[1], hullPoints[2], hullPoints[3] );
	//console.log( t1 );
	//scene.add( t1.cc );
	//console.log( scene );

	delaunay = new Delaunay( hullPoints );
	delaunay.findSuperTetrahedron();

	// setTimeout( function(){
	// 	//t1.remove();
	// 	delaunay.addPoint();
	// }, 5000 );

	// setTimeout( function(){
	// 	//t1.remove();
	// 	delaunay.addPoint();
	// }, 15000 );
	
	render();
});



function render() {
	requestAnimationFrame( render );

	renderer.render( scene, camera );
}
//render();







// Delaunay Algorithm

// an array of tetras
// an array of circumspheres ( this is in tetras now )

// first, construct a super tetrahedron ( one that contains all points )

// add points one at a time

Delaunay = function( points ){
	// points should come in as an array of THREE.Vector3 
	this.points = points;
	this.pointCount = points.length;
	this.addedPoints = [];
	this.tetras = [];
	this.pointCounter = 0;
	this.RADIUSDIFFTHRESHOLD = 0.0001;
}

Delaunay.prototype = {

	constructor: Delaunay

	,

	findSuperTetrahedron: function(){
		var minx =  Infinity;
		var maxx = -Infinity;
		var miny =  Infinity;
		var maxy = -Infinity;
		var minz =  Infinity;
		var maxz = -Infinity;

		for ( i in this.points ){
			if ( this.points[i].x < minx ) minx = this.points[i].x;
			if ( this.points[i].x > maxx ) maxx = this.points[i].x;
			if ( this.points[i].y < miny ) miny = this.points[i].y;
			if ( this.points[i].y > maxy ) maxy = this.points[i].y;
			if ( this.points[i].z < minz ) minz = this.points[i].z;
			if ( this.points[i].z > maxz ) maxz = this.points[i].z;
		}

		var bb = new THREE.Box3( new THREE.Vector3( minx, miny, minz ), new THREE.Vector3( maxx, maxy, maxz ) );
		console.log( bb );
		var bbm = new THREE.Mesh( new THREE.BoxGeometry( maxx-minx, maxy-miny, maxz-minz ), hullmaterial );
		bbm.position = new THREE.Vector3( (maxx+minx)/2, (maxy+miny)/2, (maxz+minz)/2 );
		console.log( bbm );
		scene.add( bbm );

		var stg = new THREE.Geometry();
		stg.vertices.push( new THREE.Vector3( minx-6, miny-4, minz*3 ) );
		stg.vertices.push( new THREE.Vector3( minx-6, miny-4, maxz*3 ) );
		stg.vertices.push( new THREE.Vector3( minx-6, maxy*5, (maxz+minz)/2 ) );
		stg.vertices.push( new THREE.Vector3( maxx*3, miny-4, (maxz+minz)/2 ) );

		var t2 = new Tetrahedron( stg.vertices[0], stg.vertices[1], stg.vertices[2], stg.vertices[3], -1, -2, -3, -4 );

		this.tetras.push( t2 );
		this.addedPoints.push( stg.vertices[0] );
		this.addedPoints.push( stg.vertices[1] );
		this.addedPoints.push( stg.vertices[2] );
		this.addedPoints.push( stg.vertices[3] );
	}

	,

	addPoint: function(){
		console.log( "------------------------------" );
		console.log( "ADDING A POINT TO THE DELAUNAY" );
		console.log( " it's point[ " + this.pointCounter + " ]" );
		console.log( "------------------------------" );
		console.log( this.addedPoints );
		console.log( this.tetras );

		var pointToAdd = this.points[ this.pointCounter ];
		var foundASpot = false;

		for ( i in this.tetras ){
			console.log( i );
			if ( this.tetras[i].circumsphere.containsPoint( pointToAdd ) ){
				console.log( "point to add is inside tetra[ " + i + " ]" );
				if ( foundASpot === false ){
					var oldTetraPoints = [ this.tetras[i].v1, this.tetras[i].v2, this.tetras[i].v3, this.tetras[i].v4 ];
					var oldTetraIndices = [ this.tetras[i].i1, this.tetras[i].i2, this.tetras[i].i3, this.tetras[i].i4 ];

					this.tetras[i].removeScreenRemnants();
					
					console.log( "tetras pre: " + this.tetras.length );
					this.tetras.splice( i, 1 );
					console.log( "tetras post: " + this.tetras.length );

					var newt1 = new Tetrahedron( pointToAdd, oldTetraPoints[0], oldTetraPoints[1], oldTetraPoints[2], 
												 this.pointCounter, oldTetraIndices[0], oldTetraIndices[1], oldTetraIndices[2] );
					var newt2 = new Tetrahedron( pointToAdd, oldTetraPoints[0], oldTetraPoints[2], oldTetraPoints[3], 
												 this.pointCounter, oldTetraIndices[0], oldTetraIndices[2], oldTetraIndices[3] );
					var newt3 = new Tetrahedron( pointToAdd, oldTetraPoints[0], oldTetraPoints[1], oldTetraPoints[3], 
												 this.pointCounter, oldTetraIndices[0], oldTetraIndices[1], oldTetraIndices[3] );
					var newt4 = new Tetrahedron( pointToAdd, oldTetraPoints[1], oldTetraPoints[2], oldTetraPoints[3], 
												 this.pointCounter, oldTetraIndices[1], oldTetraIndices[2], oldTetraIndices[3] );

					

					this.tetras.push( newt1 );
					this.tetras.push( newt2 );
					this.tetras.push( newt3 );
					this.tetras.push( newt4 );
					console.log( "tetras postPush: " + this.tetras.length );
					foundASpot = true;
				}
				else {
					console.log( "but we've already dont the thing" );
				}
				
				//break;
			}
		}
		console.log( this.tetras );
		this.addedPoints.push( pointToAdd );

		this.checkLocalDelaunay();

		this.pointCounter++;
		
	}

	,

	checkLocalDelaunay: function( callback ){
		// go backwards through tetras
		// if any point is within another's circumsphere, flip the shared face of the tetras
		for ( var i=this.tetras.length-1; i>=0; i-- ){
			for ( var j=4; j<this.addedPoints.length; j++ ){
				// containsPoint uses <=
				//console.log( "point to center: " + this.addedPoints[j].distanceToSquared( this.tetras[i].circumsphere.center ) );
				//console.log( "radius squared:  " + ( this.tetras[i].circumsphere.radius * this.tetras[i].circumsphere.radius - this.RADIUSDIFFTHRESHOLD ) );
				
				// make sure we're not checking one of it's own tetras
				if ( j-4 != this.tetras[i].i1 && j-4 != this.tetras[i].i2 && j-4 != this.tetras[i].i3 && j-4 != this.tetras[i].i4 ){
					if ( this.addedPoints[j].distanceToSquared( this.tetras[i].circumsphere.center ) < ( this.tetras[i].circumsphere.radius * this.tetras[i].circumsphere.radius - this.RADIUSDIFFTHRESHOLD ) === true ){
						console.log( "addedPoint[ " + j + " ] is inside tetras[ " + i + " ]" );
						console.log( "we should flip the faces of " );
						console.log( this.tetras[i] );
						console.log( this.tetras[i].i1 );
						console.log( " ... and ... " );
						for ( k in this.tetras ){
							if ( k != i && ( this.tetras[k].i1===j || this.tetras[k].i2===j || this.tetras[k].i3===j || this.tetras[k].i4===j ) ){
								console.log( " other tetra to flip: tetras[ " + k + " ]" );
								console.log( this.tetras[k].i1 );
								console.log( this.tetras[k] );
							}
						}
					}
				}
			}
		}
	}


}


Tetrahedron = function( v1, v2, v3, v4, i1, i2, i3, i4 ){
	this.v1 = v1 || new THREE.Vector3( 0, 0, 0 );
	this.v2 = v2 || new THREE.Vector3( 0, 0, 0 );
	this.v3 = v3 || new THREE.Vector3( 0, 0, 0 );
	this.v4 = v4 || new THREE.Vector3( 0, 0, 0 );

	console.log( "coming in: " + i1 + ", " + i2 + ", " + i3 + ", " + i4 );
	// indices of vertices ( do we need these? )
	this.i1 = i1;
	this.i2 = i2;
	this.i3 = i3;
	this.i4 = i4;

	console.log( "new tetra: " );
	console.log( "indices coming out: " + this.i1 + ", " + this.i2 + ", " + this.i3 + ", " + this.i4 );
	//this.circumsphere;

	this.findCircumsphere();

	//console.log( this.circumsphere.center );
	//console.log( this.circumsphere.radius );

	this.cc = new THREE.Mesh( new THREE.SphereGeometry( this.circumsphere.radius, 64, 64 ), hullmaterial );
	this.cc.position = this.circumsphere.center;
	scene.add( this.cc );

	this.v1sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 16, 16), hullmaterial );
	this.v1sphere.position = this.v1;
	scene.add( this.v1sphere );
	this.v2sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 26, 26), hullmaterial );
	this.v2sphere.position = this.v2;
	scene.add( this.v2sphere );
	this.v3sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 36, 36), hullmaterial );
	this.v3sphere.position = this.v3;
	scene.add( this.v3sphere );
	this.v4sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 46, 46), hullmaterial );
	this.v4sphere.position = this.v4;
	scene.add( this.v4sphere );

	var tg = new THREE.Geometry();
	tg.vertices.push( v1 );
	tg.vertices.push( v2 );
	tg.vertices.push( v3 );
	tg.vertices.push( v4 );
	tg.faces.push( new THREE.Face3( 0, 1, 2 ) );
	tg.faces.push( new THREE.Face3( 1, 2, 3 ) );
	tg.faces.push( new THREE.Face3( 2, 3, 0 ) );
	tg.faces.push( new THREE.Face3( 3, 0, 1 ) );
	this.tetraFaces = new THREE.Mesh( tg, material );
	scene.add( this.tetraFaces );
	//scene.add( cc );
}

Tetrahedron.prototype = {

	constructor: Tetrahedron,

	findCircumsphere: function(){
		var v1sqrd = this.v1.x*this.v1.x + this.v1.y*this.v1.y + this.v1.z*this.v1.z;
		var v2sqrd = this.v2.x*this.v2.x + this.v2.y*this.v2.y + this.v2.z*this.v2.z;
		var v3sqrd = this.v3.x*this.v3.x + this.v3.y*this.v3.y + this.v3.z*this.v3.z;
		var v4sqrd = this.v4.x*this.v4.x + this.v4.y*this.v4.y + this.v4.z*this.v4.z;

		var aM4 = new THREE.Matrix4( 	this.v1.x, this.v1.y, this.v1.z, 1,
										this.v2.x, this.v2.y, this.v2.z, 1,
										this.v3.x, this.v3.y, this.v3.z, 1,
										this.v4.x, this.v4.y, this.v4.z, 1 );

		var DxM4 = new THREE.Matrix4( 	v1sqrd, this.v1.y, this.v1.z, 1, 
										v2sqrd, this.v2.y, this.v2.z, 1,
										v3sqrd, this.v3.y, this.v3.z, 1,
										v4sqrd, this.v4.y, this.v4.z, 1 );

		var DyM4 = new THREE.Matrix4( 	v1sqrd, this.v1.x, this.v1.z, 1, 
										v2sqrd, this.v2.x, this.v2.z, 1,
										v3sqrd, this.v3.x, this.v3.z, 1,
										v4sqrd, this.v4.x, this.v4.z, 1 );

		var DzM4 = new THREE.Matrix4( 	v1sqrd, this.v1.x, this.v1.y, 1, 
										v2sqrd, this.v2.x, this.v2.y, 1,
										v3sqrd, this.v3.x, this.v3.y, 1,
										v4sqrd, this.v4.x, this.v4.y, 1 );

		var cM4 = new THREE.Matrix4( 	v1sqrd, this.v1.x, this.v1.y, this.v1.z, 
										v2sqrd, this.v2.x, this.v2.y, this.v2.z,
										v3sqrd, this.v3.x, this.v3.y, this.v3.z,
										v4sqrd, this.v4.x, this.v4.y, this.v4.z );

		var a = aM4.determinant();
		var Dx = DxM4.determinant();
		var Dy = -1*DyM4.determinant();
		var Dz = DzM4.determinant();
		var c = cM4.determinant();

		var x0 = Dx / (2*a);
		var y0 = Dy / (2*a);
		var z0 = Dz / (2*a);

		var r = ( Math.sqrt( Dx*Dx + Dy*Dy + Dz*Dz - 4*a*c ) )/( 2*Math.abs(a) );

		this.circumsphere = new THREE.Sphere( new THREE.Vector3( x0, y0, z0 ), r );
	}

	,

	removeScreenRemnants: function(){
		scene.remove( this.tetraFaces );
		scene.remove( this.v1sphere );
		scene.remove( this.v2sphere );
		scene.remove( this.v3sphere );
		scene.remove( this.v4sphere );
		scene.remove( this.cc );
	}

}

function clicked(){
	delaunay.addPoint();
}

// if added point is within any tetra's circumcircle, delete that tetra and create 4 new ones

// should check to see whether the new tetras are delaunay