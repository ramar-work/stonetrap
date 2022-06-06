/*home.js*/

/*TODO: This is INCREDIBLY sloppy.  Plz fix this*/
var dw, dh;
var scene, camera, renderer;
var geometry, material, poly;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

document.addEventListener( "DOMContentLoaded", function (ev) {

	// The main menu needs to sway in the breeze 
	var doc = document.getElementById( "hold" );
	//css3d transforms might help...

	// The background is going to rotate...
	//Either make a city,
	//or a palm tree
	//or an ocean, if you're feeling simple...
	try {
		dw = window.innerWidth;
		dh = window.innerHeight;
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xffffff );
		camera = new THREE.PerspectiveCamera( 75, dw / dh, 0.2, 1000 ) 
		renderer = new THREE.WebGLRenderer( /*{antialias: true} */);
		renderer.setSize( dw, dh ); 
		document.body.appendChild( renderer.domElement );	
		camera.position.z = 3;	
		camera.position.x = 1;
		camera.position.y = 0;	
		camera.rotation.z += 0.07;
		camera.rotation.y += 0.1;

		//Add the shape (don't care)
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		//show the scene
		renderer.render( scene, camera );
		var animate = function () {
			requestAnimationFrame( animate );
			camera.rotation.z += 0.005;
			//camera.rotation.x += 0.005;
			//camera.rotation.y += 0.01;
			renderer.render( scene, camera );
		}

		//be interactive!
		animate();
	}
	catch (e) {
		console.log( e );
	}

});
