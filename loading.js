import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from "three/examples/jsm/controls/DragControls";

			let camera, scene, renderer;
			let clock = new THREE.Clock();
			let mixer;
			init();
			animate();
			function init() {
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set(0,50,150);
				camera.lookAt(0,0,100)
				scene = new THREE.Scene();
				// {
				// 	const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
				// 	scene.add( directionalLight );
				// }
				{
					const lightPoint = new THREE.PointLight( 0xf0f, 100, 1000);
					lightPoint.position.set(0,30,100);
					scene.add( lightPoint );
				}
	
				scene.background = new THREE.Color( 0x000);
			
				{
					const loader = new GLTFLoader();
					loader.load('./Dancing.glb', (gltf) => {
						console.log(gltf);
						const model = gltf.scene;
						mixer = new THREE.AnimationMixer(model);
						mixer.clipAction(gltf.animations[0]).play();
						gltf.scene.castShadow = true;
						gltf.scene.receiveShadow = true;
						gltf.scene.position.set(0,0,100);
						gltf.scene.scale.set(200,200,200)
						scene.add( gltf.scene );
						const controls = new DragControls( [gltf.scene], camera, renderer.domElement );
				// add event listener to highlight dragged objects
						// controls.addEventListener( 'dragstart', function ( event ) {
						// 	event.object.material.emissive.set( 0xaaaaaa );
						// } );

						// controls.addEventListener( 'dragend', function ( event ) {
						// 	event.object.material.emissive.set( 0x000000 );
						// } );
						})
					}
				// {
				// 	const helper = new THREE.CameraHelper( camera );
				// 	scene.add( helper );
				// }
			
				

				renderer = new THREE.WebGLRenderer( { antialias: true, precision: "highp" } );
				renderer.compile(scene,camera);
				// renderer.setClearColor(0xf0f);
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			
			function animate() {
                var delta = clock.getDelta();
				if ( mixer ) mixer.update( delta );
				cubes[0].rotation.x += 0.01
				cubes[0].rotation.y += 0.011
				cubes[1].rotation.x += 0.012
				cubes[1].rotation.y += 0.013
				cubes[2].rotation.x += 0.014
				cubes[2].rotation.y += 0.015
				renderer.render( scene, camera );
				requestAnimationFrame( animate );
			}
