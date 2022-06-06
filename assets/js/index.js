/*index.js*/

/*different levels tiles can be laid out here., this won't be efficient but it
 * would do*/

const base = "/fetch/";
const debug = 1;
const shroudName = "fugazi";
//TODO: Let the user set these in the future...
const options = {
	antialias: false,
}
var zMultiplier = 1;
var zTileRotation = 1.57;
var dvd; //global debug window


function Log( a ) {

}



//TODO: Consider initializing this via create_scene( Level )
var Engine = {
	audio: null
, camera: null
, cw: 0
, ch: 0
, dw: window.innerWidth
, dh: window.innerHeight
, scene: null
, shroud: null
, renderer: null
}


//TODO: All the buffer and sync crap should be in here
function Audio() {
	//hold all audio
	var cache = {};

	return {
		easy: function( file ) {

		},

		initialize: function( /*music_cache*/ ) {
			//Get audio block
			cache.domE = document.getElementById( "main-audio-player" );
			var AudioCtx = window.AudioContext || window.webkitAudioContext;

			//This should set up everything else...	
			cache.audioCtx = new AudioCtx();	
			cache.track = cache.audioCtx.createMediaElementSource( cache.domE );
			cache.track.connect( cache.audioCtx.destination );
			cache.track.loop = true;
		},

		//Play
		play: function () {
			//Stop audio
console.log( cache.audioCtx.state );
			if ( cache.audioCtx.state === 'suspended' ) {
				cache.audioCtx.resume();
			}

			if ( ( cache.playing = !cache.playing ) == 1 ) {
				cache.domE.play();
			}
			else {
				cache.domE.pause();
			}
		},

		//Set audio
		set: function ( filename ) {
			//cache.domE = document.getElementById( "main-audio-player" );
			var AudioCtx = window.AudioContext || window.webkitAudioContext;
			
			//add the audio element on the fly
			cache.domE = document.createElement( "audio" );
			cache.domE.id = "main-audio-player";
			console.log( cache.domE );
			//document.querySelector(".player-inner").appendChild( cache.domE );

			//This should set up everything else...	
			cache.audioCtx = new AudioCtx();	
			cache.track = cache.audioCtx.createMediaElementSource( cache.domE );
			cache.track.connect( cache.audioCtx.destination );

			//set sources
			var src = document.createElement( "source" );
			src.src = filename;
			//src.type = "mp
			cache.domE.appendChild( src );
			cache.domE.volume = 0.1;
		}
	}
}


//TODO: Need to know the tile size (at any reso), 
//and the row width (which shouldn't change but is loaded only once)
function calculateClick( ev ) {
	const tilesize = 128;
	var ts = tilesize * zMultiplier;
	var px = Math.ceil( ev.offsetX / ts ) - 1;
	var py = Math.ceil( ev.offsetY / ts ) - 1;
	var xy = (py * 5) + px;
	return {
		px: px
	, py: py
	, xy: xy
	}
}


function generateSimpleSolid( ImagePath ) { 
	/*
	tx.wrapS = THREE.RepeatWrapping;
	tx.wrapT = THREE.RepeatWrapping;
	tx.repeat.set( 4, 4 );
	*/
	var geometry = new THREE.BoxGeometry( 2.6, 2.6, 0.5 );
	var tx = new THREE.TextureLoader().load( ImagePath );
	var material = new THREE.MeshBasicMaterial({ /*color: 0x00ffff ,*/map: tx });
	  
	return { 
		geometry: geometry
	 ,material: material
	 ,node: new THREE.Mesh( geometry, material ) 
	};
}


//Redraw the window
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


//Returns a scene
function create_scene( Level ) {
	try {
		//Initialize options
		var roptions = {
			antialias: options.antialias
		, alpha: true
		};

		Engine.dw = window.innerWidth;
		Engine.dh = window.innerHeight;
		Engine.scene = new THREE.Scene();
		//scene.background = new THREE.Color( 0x000000 );
		Engine.camera = new THREE.PerspectiveCamera( 50, Engine.dw / Engine.dh, 1, 1000 ) 
		Engine.renderer = new THREE.WebGLRenderer( roptions );
		Engine.renderer.setSize( Engine.dw, Engine.dh ); 
		Engine.renderer.setClearColor( 0x000000, 0 ); 
		Engine.renderer.render( Engine.scene, Engine.camera );
		Engine.camera.position.z = 20.5;
		Engine.camera.position.x = 6.0;
		Engine.camera.position.y = 6.0;
		Engine.camera.rotation.z += 1.57;
		Engine.camera.rotation.y += 0.0;

		//Show the scene
		document.body.appendChild( Engine.renderer.domElement );	
		Engine.cw = Engine.renderer.domElement.width;
		Engine.ch = Engine.renderer.domElement.height;
		console.log( Engine.cw );
		console.log( Engine.ch );

		//Generate the main animation loop
		var animate = function () {
			requestAnimationFrame( animate );
			//camera.rotation.z += 0.100;
			//.rotation.x += 0.005;
			//poly.rotation.y += 0.01;
			Engine.renderer.render( Engine.scene, Engine.camera );
		}
		animate();
		return Engine.scene;
	}
	catch (e) {
		console.log( e );
		return null;
	}
}


//Creates an overlay to track where the user clicks
function create_overlay( Level ) {
	var div = document.createElement( "div" );
	div.id = shroudName;

	//We can use the level ratios as a starting point, but they'll have to be adjusted by the z position (somehow)
	var hh = Level.height * zMultiplier;
	var ww = Level.width * zMultiplier;
	div.style.width = ww;
	div.style.height = hh;
	div.style.position = "fixed";
	div.style.top = Engine.dh - hh - ((Engine.dh - hh) / 2);
	div.style.left = Engine.dw - ww - ((Engine.dw - ww) / 2);
	div.style.zIndex = 9999;
	console.log( div.style.width ); console.log( div.style.height );
	document.body.appendChild( div );

	if ( debug ) {
		div.style.border = "2px solid red";
	}

	//Track the cursor position
	div.addEventListener("mousemove", function (ev) {
		if ( debug ) {
			dvd.innerHTML = calculateClick(ev).xy;
		}
	});
	return div;
}


function generate_nodes( Level, Scene ) {
	//Generate the points ahead of time...
	var ipos=0, pos = []; 
	for ( var x=0; x<13; x += 3 ) {
		for ( var y=0; y<13; y += 3 ) {
			pos[ ipos++ ] = [ x, y ];
		}	
	}

	//Generate the general node map and each node too
	//var nodes = [];	
	for ( var i=0; i < Level.imgarray.length; i++ ) {
		//...
		Level.nodes[ i ] = {
			pxy:	[ 0, 0 ]
			//slap the image onto the canvas
		//, threeref: generateSimpleSolid( "/assets/img/sq/" + imgset[ i ]  )
		, threeref: Level.threeObjects[ i ]
		//, domref: document.createElement( "li" )
		,	audio: null
		, anim: null
		//random between 1 & 4, consider using a cube
		, orientation: Math.floor( Math.random() * (5 - 1) ) + 1
		};

		//both color and orientation can be used to make this incredibly difficult
		//you can also display a map of what the image SHOULD look like in EASY
		//mode

		//add domref, we reference this later
		//ul.appendChild( nodes[i].domref );	

		//add three ref
		Level.nodes[i].threeref.node.rotation.z = 
			Level.nodes[ i ].orientation * zTileRotation;
		Level.nodes[i].threeref.node.position.set( pos[i][0], pos[i][1], 0 );
		console.log( pos[i] );
		Scene.add( Level.nodes[i].threeref.node );
	}
	return true;
}


function redraw_overlay( level ) {
	console.log( 'redrawing #fugazi' );
	var fugazi = document.getElementById( shroudName );
	fugazi.parentElement.removeChild( fugazi ); 
	if ( !( fugazi = create_overlay( level )) ) {
		console.log( "Failed to init shroud." );
		return
	}
	fugazi.addEventListener("mousedown", init_user_controls( level.nodes ) );
}


function modify_z( change, level ) {
	Engine.camera.position.z += change;
	zMultiplier += ( change > 0 ) ? -0.02 : 0.02;
	console.log( Engine.camera.position.z );
	redraw_overlay( level );
}


function generate_debug_window( Level ) {
	var level = Level;
	dvd = document.createElement( "div" );
	dvd.style.position = "absolute";
	dvd.style.bottom = "100px";
	dvd.style.right = "50px";  
	dvd.style.width = "120px"; 
	dvd.style.height = "50px"; 
	dvd.style.background = "rgba( 100, 230, 100, 0.3 )";
	dvd.style.borderRadius = "10px";
	dvd.style.padding = "10px";
	dvd.style.color = "#000000";
	document.body.appendChild( dvd );

	document.addEventListener("keydown", function (ev) {
		if ( ",.;'-=".indexOf( ev.key ) > -1 ) {
			cr = Engine.camera.rotation;
			if (",.".indexOf( ev.key ) > -1) cr.z += ( ev.key == ',' ) ? -0.1 : 0.1;
			if (";'".indexOf( ev.key ) > -1) cr.y += ( ev.key == ';' ) ? -0.1 : 0.1;
			if ("-=".indexOf( ev.key ) > -1) cr.x += ( ev.key == '-' ) ? -0.1 : 0.1;
			dvd.innerHTML = Engine.camera.rotation.z;
		}
		if ( "[]".indexOf( ev.key ) > -1 ) {
			if ( ev.key == '[' ) modify_z( 0.5, level ); 
			if ( ev.key == ']' ) modify_z( -0.5, level ); 
		}
		if ( ev.key == 'q' ) {
			getNodePositions();
		} 
	});


	//track movements here
	var oldXy = 0;
	document.getElementById( shroudName ).addEventListener("mousemove", function (ev) {
		//now the tricky part, oX & oY need to be used to find the right index
		var click = calculateClick( ev );	
		dvd.innerHTML = click.xy;

		//Extra verbose position information
		/*
		console.log([
			"ev.ox: ", ev.offsetX, ", ",
			"ev.oy: ", ev.offsetY, ", ",
			"px: ", click.px,", ",
			"py: ", click.py,", ",
			"xy: ", click.xy 
		].join(""));
		*/

		if ( oldXy != click.xy ) { 
			//nodes[ oldXy ].threeref.node.material.color = new THREE.Color(0x00ffff); 
		}
		//nodes[xy].threeref.node.material.color = new THREE.Color(0xffff00); 
		oldXy = click.xy;
	});

	document.getElementById(shroudName).addEventListener("mouseout", function (ev) {
		//nodes[oldXy].threeref.node.material.color = new THREE.Color(0xffff00); 
		//cancelAnimationFrame( nodes[oldXy].anim ); 
	});

	return dvd;
}


function getNodePositions( Nodeset_ ) {
	var pos=[];
	Nodeset_.forEach( function(x) { pos.push( x.threeref.node.rotation.z ); } );
	console.log( pos );
	return pos;
}


function checkNodeCompletion( Nodeset_ ) {
	var yes = true;
	Nodeset_.forEach( function (zRot) {
		if ( zRot > zTileRotation || zRot < zTileRotation - 0.01 ) {
			yes = false;
		}
	});
	return yes;
}


//document.getElementById( shroudName ).addEventListener("mousedown", function (ev) {
function init_user_controls( Nodeset_ ) {
	var Nodeset = Nodeset_;

	const heightConstant = 0.4;
	const jumpConstant = 3;
	const rotation = 1.56;

	return function (ev) {
		console.log( 'click occurred' );	
		var click = calculateClick( ev );	
		var cancel;

		//Lift the thing, and do something
		var animState = 1;
		anim = function (evt) {
			var c; 
			var nz = Nodeset[ click.xy ].orientation; 
			var zp = nz * rotation; 

			//Control all different animation states via the same function
			if ( animState == 1 ) {
				Nodeset[ click.xy ].threeref.node.position.z += heightConstant; 
				c = requestAnimationFrame( anim );
				cancel = ( Nodeset[ click.xy ].threeref.node.position.z >= jumpConstant ); 
			}
			else if ( animState == 2 ) {
				Nodeset[ click.xy ].threeref.node.rotation.z += heightConstant;
				c = requestAnimationFrame( anim );
				cancel = ( Nodeset[ click.xy ].threeref.node.rotation.z >= zp ); 
			}
			else if ( animState == 3 ) {
				Nodeset[ click.xy ].threeref.node.position.z -= heightConstant;
				c = requestAnimationFrame( anim );
				cancel = ( Nodeset[ click.xy ].threeref.node.position.z <= 0 ); 
			}

			if ( cancel ) {
				//Set hard limits after full cancel
				if ( animState == 1 )
					Nodeset[ click.xy ].threeref.node.position.z = jumpConstant;
				else if ( animState == 2 )
					Nodeset[ click.xy ].threeref.node.rotation.z = zp;
				else if ( animState == 3 ) {
					Nodeset[ click.xy ].threeref.node.position.z = 0;
					Nodeset[ click.xy ].orientation = ( nz == 4 ) ? 1 : ++nz;
				}
				cancelAnimationFrame( c );
				cancel = 0;
				animState++; 
				c = requestAnimationFrame( anim );
			}
		}
		//console.log( Nodeset );
		//when all of the rotation.z points are the same, that should solve the problem
		var nodepoints = getNodePositions( Nodeset );
		if ( checkNodeCompletion( nodepoints ) ) {
			console.log ( "Game is done!" );
			//animate the tiles inward
			//z and rotate all the way out
			//keep music playing through the next level
			//display the pop-up
		}	
		requestAnimationFrame( anim );
	}
}


function load_level_resources( LevelName ) {
	//Make a request for the level's metadata
	var payload, level, xhr = new XMLHttpRequest();
	xhr.open( "GET", LevelName, false );
	xhr.send();

	//TODO: Make this asynchronous...
	if ( xhr.status != 200 ) {
		;//console.log( xhr.status, xhr.responseText );
	}
	else {
		//console.log( xhr.responseText );
		try {
			//payload = JSON.parse( xhr.responseText );
			level = JSON.parse( xhr.responseText );
			level.threeObjects = [];
			level.nodes = [];	
		}
		catch (e) {
			console.log( e );
			return null;
		}
	}

	//Make requests for each image here
	for ( var i=0; i < level.imgarray.length; i++ ) {
		level.threeObjects.push( generateSimpleSolid( level.imgarray[ i ].path ) );
	}

	//Also populate the thumbnail of the hint image (when asked for)
	//...

	//Finally, need to initialize audio 
	//console.log(level);
	return level;
}


function babyRouter( url ) {
	var href = url.split( "/" );
	//could use some mapping...
	return href;
}


document.addEventListener("DOMContentLoaded", function (evt) {

	var level, href, scene, nodes, debug_w;

	//Let JS get the level from the URL
	if ( !( href = babyRouter( window.location.pathname ) ) || href.length < 2 ) {
		console.log( "Route not allowed: ", href.length, href );
		return
	}

	//Load all the images first, and track progress of request. localStorage might be best
	if ( !( level = load_level_resources( base + href[2] ) ) ) {
		console.log( "level generation failed." );
		return
	}

	//Create a scene
	if ( !( scene = create_scene() ) ) {
		//Let the user know that three failed to init...
		console.log( "THREE.js initialization failed." );
		return
	}

	//Here is probably where the level generator would take over...
	if ( !generate_nodes( level, scene ) ) {
		console.log( "Node generation failed." );
		return
	}

	//create an overlay here
	if ( !( Engine.shroud = create_overlay( level ) ) ) {
		console.log( "Failed to init shroud..." );
		return
	}

	//document.getElementById( shroudName )
	Engine.shroud
		.addEventListener( "mousedown", init_user_controls( level.nodes ) );

	//handle resizes
	window.addEventListener( "resize", function () {
		//Resize three .js stuff
		Engine.dw = window.innerWidth;
		Engine.dh = window.innerHeight;
		Engine.camera.aspect = window.innerWidth / window.innerHeight;
		Engine.camera.updateProjectionMatrix();
		Engine.renderer.setSize( window.innerWidth, window.innerHeight );

		//...
		redraw_overlay(level);
	}, false );

	//Initialize audio
	Engine.audio = new Audio();
	Engine.audio.isInit = 0;
	var el = window.addEventListener( "click", function(ev) {
		if ( !Engine.audio.isInit ) {
			Engine.audio.initialize();
			Engine.audio.set( level.bgmusic );
			Engine.audio.play();
			Engine.audio.isInit = 1;
			window.removeEventListener( "click", el );
		}
	});

	//when all the nodes reach a particular orientation, we should be good...
	if ( debug ) {
		generate_debug_window( level );
	}
});
