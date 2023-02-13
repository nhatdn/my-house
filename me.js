import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene()
const light = new THREE.PointLight()
light.position.set(10, 10, 10)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3
camera.position.y = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const lightPoint = new THREE.PointLight( 0xffffff , 15, 200 );
lightPoint.position.set( 0, 100, 100);
scene.add( lightPoint );

const loader = new GLTFLoader();
loader.load('./me.glb', (gltf) => {
    scene.add(gltf.scene);
});

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    render()

}

function render() {
    renderer.render(scene, camera)
}

animate()