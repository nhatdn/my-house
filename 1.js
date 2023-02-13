import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
let x = 0.1;
camera.position.z = 10;
// document.addEventListener('keydown', (e) => {
//     if(e.ctrlKey) {
//         camera.position.z +=x;
//     } else {
//         camera.position.z -=x;
//     }
// })
// let logMouse = false;
// document.addEventListener('mousedown', (event) => {
//     logMouse = true;
// })

// document.addEventListener('mousemove', (event) => {
//     if(logMouse) {
//         console.log(event.screenX + "-" + event.screenY);
//         console.log(event);
//     }
// })

// document.addEventListener('mouseup', () => {
//     logMouse = false;
// })

camera.lookAt( 0, 0, 0);
{
    const material = new THREE.MeshBasicMaterial({ color: "red"});
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);
}

{
    const material = new THREE.LineBasicMaterial({color : 'green'});
    const points = [];
    points.push(new THREE.Vector3(-3, 0, 0));
    points.push(new THREE.Vector3(0, 3, 0));
    points.push(new THREE.Vector3(3, 0, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry,material);
    scene.add(line);
}

{
    const loader = new FontLoader();
    loader.load( 'https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_bold.typeface.json', function ( font ) {
        const geometry = new TextGeometry( 'Hello world', {
            font: font,
            size: 0.5,
            height: 1,
        });
        const materials = [
            new THREE.MeshBasicMaterial({ color: 'green' }), // front
            new THREE.MeshBasicMaterial({ color: 'red' }) // side
        ];
        const textMesh1 = new THREE.Mesh(geometry, materials);
        scene.add(textMesh1);
    });
}

const controls = new PointerLockControls( camera, document.body );
document.onclick = () => {
    controls.lock();
}
scene.add( controls.getObject() );
let right = 0;
document.addEventListener('keydown', () => {
    right+=0.1;
    controls.moveRight(right);
})
renderer.setSize(window.innerWidth, window.innerHeight)
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();