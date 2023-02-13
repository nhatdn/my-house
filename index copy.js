import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls'

			let camera, scene, renderer, controls;
			const objects = [];
			let raycaster;
			let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
			let canJump = false;
            let shift = 0.16;
			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();
			let clock = new THREE.Clock();
			let mixer;
			let x;
			const geometry = new THREE.BoxGeometry(20, 20, 20);
			const material = [
				new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true }),
				new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true }),
				new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true })
			]
			const cubes = [
				new THREE.Mesh(geometry, material[0]),
				new THREE.Mesh(geometry, material[1]),
				new THREE.Mesh(geometry, material[2])
			]
			cubes[0].position.x = -30
			cubes[0].position.y = 20
			cubes[1].position.x = 0
			cubes[1].position.y = 20
			cubes[2].position.x = 30
			cubes[2].position.y = 20
	

			init();
			animate();
			function init() {

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.set(0,400,0);

				scene = new THREE.Scene();
				// scene.background = new THREE.Color( 0xffffff );
				scene.background = new THREE.Color( 0x000000 );
				// cubes.forEach((c) => scene.add(c))
				// scene.fog = new THREE.Fog( 0xffffff, 1000, 2000 );

				// const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
				// light.position.set( 0.5, 1, 0.75 );
				// scene.add( light );

				controls = new PointerLockControls( camera, document.body );

				const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				{
					const loader = new GLTFLoader();
					loader.load('./old_house.glb', (gltf) => {
						gltf.scene.position.set(0,1,1)
						gltf.scene.scale.set(200,200,200)

						scene.add( gltf.scene );
					})
				}
				{

					
					{
					const loader = new GLTFLoader();
					loader.load('./Dancing.glb', (gltf) => {
						console.log(gltf);
						const model = gltf.scene;
						mixer = new THREE.AnimationMixer(model);
						mixer.clipAction(gltf.animations[0]).play();
						gltf.scene.castShadow = true;
						gltf.scene.receiveShadow = true;
						gltf.scene.position.set(0,-0.5,0);
						gltf.scene.scale.set(20,20,20);
						const temp = new THREE.Mesh( new THREE.BoxGeometry(1,1.5,1), new THREE.MeshPhongMaterial({ transparent: true, opacity: 0}))
						temp.add(gltf.scene);
						temp.position.x = 4;
						scene.add(temp);
						x = new DragControls([...cubes, temp], camera, renderer.domElement);
						})
					}
				}
				const lightPoint = new THREE.PointLight( 0xffffff , 20, 3000 ); //0xFFED00
				lightPoint.position.set( 1800, 600, 1050);
				scene.add( lightPoint );

				instructions.addEventListener( 'click', function () {

					controls.lock();

				} );

				controls.addEventListener( 'lock', function () {

					instructions.style.display = 'none';
					blocker.style.display = 'none';

				} );

				controls.addEventListener( 'unlock', function () {

					blocker.style.display = 'block';
					instructions.style.display = '';

				} );

				scene.add( controls.getObject() );

				const onKeyDown = function ( event ) {
					switch ( event.code ) {
                        case 'ShiftLeft': {
                            shift = 0.15;
                            break;
                        }
						case 'ArrowUp':
						case 'KeyW':
							moveForward = true;
							break;

						case 'ArrowLeft':
						case 'KeyA':
							moveLeft = true;
							break;

						case 'ArrowDown':
						case 'KeyS':
							moveBackward = true;
							break;

						case 'ArrowRight':
						case 'KeyD':
							moveRight = true;
							break;

						case 'Space':
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;

					}

				};

				const onKeyUp = function ( event ) {

					switch ( event.code ) {
                        case 'ShiftLeft': {
                            shift = 0.15;
                            break;
                        }
						case 'ArrowUp':
						case 'KeyW':
							moveForward = false;
							break;

						case 'ArrowLeft':
						case 'KeyA':
							moveLeft = false;
							break;

						case 'ArrowDown':
						case 'KeyS':
							moveBackward = false;
							break;

						case 'ArrowRight':
						case 'KeyD':
							moveRight = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown );
				document.addEventListener( 'keyup', onKeyUp );

				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

				// floor

				let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
				floorGeometry.rotateX( - Math.PI / 2 );

				// vertex displacement

				let position = floorGeometry.attributes.position;

				// for ( let i = 0, l = position.count; i < l; i ++ ) {

				// 	vertex.fromBufferAttribute( position, i );

				// 	vertex.x += Math.random() * 20 - 10;
				// 	vertex.y += Math.random() * 2;
				// 	vertex.z += Math.random() * 20 - 10;

				// 	position.setXYZ( i, vertex.x, vertex.y, vertex.z );

				// }

				floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

				position = floorGeometry.attributes.position;
				const colorsFloor = [];

				for ( let i = 0, l = position.count; i < l; i ++ ) {

					color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
					colorsFloor.push( color.r, color.g, color.b );

				}

				floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

				const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );

				const floor = new THREE.Mesh( floorGeometry, floorMaterial );
				//scene.add( floor );

				// objects

				const boxGeometry = new THREE.BoxGeometry( 20, 20, 20 ).toNonIndexed();

				position = boxGeometry.attributes.position;
				const colorsBox = [];

				for ( let i = 0, l = position.count; i < l; i ++ ) {

					color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
					colorsBox.push( color.r, color.g, color.b );

				}

				boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );

				// for ( let i = 0; i < 500; i ++ ) {

				// 	const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
				// 	boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

				// 	const box = new THREE.Mesh( boxGeometry, boxMaterial );
				// 	box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
				// 	box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
				// 	box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

				// 	scene.add( box );
				// 	objects.push( box );

				// }

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}
			
			function animate() {
                
				requestAnimationFrame( animate );
				var delta = clock.getDelta();
				if ( mixer ) mixer.update( delta );
				const time = performance.now();
				// cubes[0].rotation.y += 0.011
				// cubes[1].rotation.x += 0.012
				// cubes[1].rotation.y += 0.013
				// cubes[2].rotation.x += 0.014
				// cubes[2].rotation.y += 0.015
				if ( controls.isLocked === true ) {

					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;

					const intersections = raycaster.intersectObjects( objects, false );

					const onObject = intersections.length > 0;

					const delta = (( time - prevTime ) / 1000) + shift;
					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveRight ) - Number( moveLeft );
					direction.normalize(); // this ensures consistent movements in all directions

					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

					if ( onObject === true ) {

						velocity.y = Math.max( 0, velocity.y );
						canJump = true;

					}

					controls.moveRight( - velocity.x * delta );
					controls.moveForward( - velocity.z * delta );

					controls.getObject().position.y += ( velocity.y * delta ); // new behavior

					if ( controls.getObject().position.y < 300 ) {
						//console.log(controls.getObject().position)
						velocity.y = 0;
						controls.getObject().position.y = 300;

						canJump = true;

					}

				}

				prevTime = time;

				renderer.render( scene, camera );

			}
