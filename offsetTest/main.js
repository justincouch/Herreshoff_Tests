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
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//var hullmaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var hullmaterial = new THREE.MeshDepthMaterial( );
//hullmaterial.side = THREE.DoubleSide;
hullmaterial.wireframe = true;
hullmaterial.wireframeLinewidth = 3;
hullmaterial.transparent = true;
hullmaterial.opacity = 0.5;
var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 20;



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

	var del = Delaunay.triangulate( hullPoints );
	console.log( del );

	var myDel = tri3d( hullPoints );
	console.log( myDel );
	
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
	render();
});



function render() {
	requestAnimationFrame( render );

	renderer.render( scene, camera );
}
//render();