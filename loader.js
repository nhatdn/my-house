import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()

const light1 = new THREE.PointLight(0xffffff, 2)
light1.position.set(2.5, 2.5, 2.5)
scene.add(light1)

const light2 = new THREE.PointLight(0xffffff, 2)
light2.position.set(-2.5, 2.5, 2.5)
scene.add(light2)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
)
camera.position.set(0.8, 1.4, 10.0)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
let mixer
let modelReady = false
const gltfLoader = new GLTFLoader()
const clock = new THREE.Clock()

gltfLoader.load(
    './me.glb',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        gltf.scene.scale.add(2,2,2);
        scene.add(gltf.scene)
        window.scene = gltf.scene;
        gltfLoader.load(
            './dance.glb',
            (gltf) => {
                console.log('loaded dance')
                const animationAction = mixer.clipAction(
                    (gltf).animations[0]
                )
                animationAction.reset()
                animationAction.fadeIn(1)
                animationAction.play()
                modelReady = true
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)





function animate() {
    requestAnimationFrame(animate)
    if (modelReady) mixer.update(clock.getDelta())
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()