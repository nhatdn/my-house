import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
			let camera, scene, renderer;
			let clock = new THREE.Clock();
            let controls;
			let mixer;
            let player;
			init();
			animate();
			function init() {
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set(0,50,150);
				camera.lookAt(0,0,100)
				scene = new THREE.Scene();
                const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
                mesh.rotation.x = - Math.PI / 2;
                mesh.receiveShadow = true;
                scene.add( mesh );
                const gridHelper = new THREE.GridHelper( 100, 100 );
                scene.add( gridHelper );
				{
					const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
					scene.add( directionalLight );
				}
				scene.background = new THREE.Color( 0x000);
				{
					const loader = new GLTFLoader();
					loader.load('./Dancing.glb', (gltf) => {
						player = gltf.scene;
						mixer = new THREE.AnimationMixer(player);
                        player.add( camera );
						mixer.clipAction(gltf.animations[0]).play();
						gltf.scene.castShadow = true;
						gltf.scene.receiveShadow = true;
						gltf.scene.position.set(0,0,100);
						gltf.scene.scale.set(200,200,200)
						scene.add( gltf.scene );
						})
					}
				renderer = new THREE.WebGLRenderer({antialias: true});
                controls = new OrbitControls( camera, renderer.domElement );
                controls.update();
				renderer.compile(scene,camera);
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
                if(player) {
                    camera.lookAt( player.position );
                }
                controls.update();
				requestAnimationFrame( animate );
			}
