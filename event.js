import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))
let clock = new THREE.Clock();
let mixer;

const light = new THREE.PointLight()
light.position.set(10, 10, 10)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()

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
cubes[0].position.x = -2
cubes[1].position.x = 0
cubes[2].position.x = 2
cubes.forEach((c) => scene.add(c))
let x;
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

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
// document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    cubes[0].rotation.x += 0.01
    cubes[0].rotation.y += 0.011
    cubes[1].rotation.x += 0.012
    cubes[1].rotation.y += 0.013
    cubes[2].rotation.x += 0.014
    cubes[2].rotation.y += 0.015

    render()

    // stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()