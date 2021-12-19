import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from './three.js-master/src/loaders/FontLoader.js'
import { TextGeometry } from './three.js-master/src/geometries/TextGeometry.js'

let scene, camera, renderer;

let onPointerDownPointerX, onPointerDownPointerY, onPointerDownLon, onPointerDownLat;

let lon = 0, lat = 0;
let phi = 0, theta = 0;


//textures
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


    //3D text
    const loaderFont = new THREE.FontLoader();
    let geometry;

    loaderFont.load( 'fonts/helvetiker_bold.typeface.json', 
        //Create 3D text after loading the font
        function ( font ) {
            geometry = new THREE.TextGeometry( 'HAPPY NEW YEAR SUNERZHA', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 25,
                bevelSize: 2,
                bevelSegments: 5
            } );
            //Create normal vector material
            var meshMaterial = new THREE.MeshNormalMaterial({
                flatShading: THREE.FlatShading,
                transparent: true,
                opacity: 0.9
        });
            var mesh = new THREE.Mesh(geometry, meshMaterial);
            mesh.position.set(-750, -600, 0);
            scene.add(mesh);
        },
        //Load progress
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        //An error occurred
        function (err) {
            console.log(err);
        }
     );


    //Resize
    window.addEventListener('resize', onWindowResize, false)
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight)
    }


    // keyboard move
    function onPointerDown(event) {
        event.preventDefault();
      
        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;
      
        onPointerDownLon = lon;
        onPointerDownLat = lat;
      
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
    }
      
      function onPointerMove(event) {
        lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }
      
      function onPointerUp() {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
    }
      
      function onDocumentMouseWheel(event) {
        const fov = camera.fov + event.deltaY * 0.05;
      
        camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
      
        camera.updateProjectionMatrix();
    }


    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        // renderer.render(scene, camera)
        render();
    }
    animate();
}

function render() {
  const time = Date.now();

  lon += 0.15;

  lat = Math.max(-85, Math.min(85, lat));
  phi = THREE.MathUtils.degToRad(90 - lat);
  theta = THREE.MathUtils.degToRad(lon);

  scene.position.x = Math.cos(time * 0.001) * 1;
  scene.position.y = Math.sin(time * 0.001) * 1;
  scene.position.z = Math.sin(time * 0.001) * 1;

  // scene.rotation.x += 0.002;
  scene.rotation.y += 0.003;

  camera.position.x = 2000 * Math.sin(phi) * Math.cos(theta);
  camera.position.y = 1000 * Math.cos(phi);
  camera.position.z = 1000 * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}


// count time
const text = document.querySelector('.time');

let myInt = setInterval(()=>{
    let now = new Date();
    let newyear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    let result = newyear.getTime() - now.getTime();
    text.innerText = result;

     // add nulls to make number more then 10 letters
  if(result < 1){
    text.innerText = "000000000";
    }else if(result < 10){
        text.innerText = "00000000" + result;
    }else if(result < 100){
        text.innerText = "0000000" + result;
    }else if(result < 1000){
        text.innerText = "000000" + result;
    }else if(result < 10000){
        text.innerText = "00000" + result;
    }else if(result < 100000){
        text.innerText = "0000" + result;
    }else if(result < 1000000){
        text.innerText = "000" + result;
    }else if(result < 10000000){
        text.innerText = "00" + result;
    }else if(result < 100000000){
        text.innerText = "000" + result;
    }
}, 1);

//stop counting 
text.addEventListener("click", function(){
    clearInterval(myInt);
    let today = new Date();
    let victorineDay = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    let victorineResult = victorineDay.getTime() - today.getTime();
  
    text.innerText = victorineResult;
});


 



