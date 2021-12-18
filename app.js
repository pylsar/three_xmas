import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js'

let scene, camera, renderer;

const textureLoader = new THREE.TextureLoader();

textureLoader.load("model/1.jpg", function (texture) {
  texture.encoding = THREE.sRGBEncoding;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  init(texture);
});

function init(texture) {
    let container = document.querySelector('.container');



    //Scene
    scene = new THREE.Scene()
    scene.background = texture;

    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 1500;
    camera.position.y = 50;
    camera.position.x = 0;

    //render
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)


    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.minDistance = 40;

    //light
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient)

    let light = new THREE.PointLight(0xc4c4c4, 1);
    light.position.set(0, 300, 500);
    scene.add(light)

    let light2 = new THREE.PointLight(0xc4c4c4, 1);
    light2.position.set(500, 300, 500);
    scene.add(light2)

    let light3 = new THREE.PointLight(0xc4c4c4, 1);
    light3.position.set(0, 300, -500);
    scene.add(light3)

    let light4 = new THREE.PointLight(0xc4c4c4, 1);
    light4.position.set(-500, 300, 500);
    scene.add(light4)

    //model
    const loader = new GLTFLoader();
    loader.load('./model/scene.gltf', gltf => {
        scene.add(gltf.scene);
    }, 
        function (error) {
            console.log('Error: ' + error)
        }
    )

    //Resize
    window.addEventListener('resize', onWindowResize, false)
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        renderer.render(scene, camera)
    }
    animate()
}