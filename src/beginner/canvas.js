import {
  AmbientLight,
  FogExp2,
  WebGLRenderer,
  Raycaster,
  Scene,
  Vector2,
} from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Camera } from './camera';
import { Cube } from './cube';
import { Grid } from './grid';
import { Light } from './light';
import { Plane } from './plane';
import { Sphere } from './sphere';
import { resizeRendererToDisplaySize } from './utils';
import { GUI } from 'dat.gui'

const canvas = document.querySelector('#c');
const renderer = new WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild(renderer.domElement);

const scene = new Scene();

const { camera } = Camera();

new OrbitControls(camera, canvas).update();

const stats = Stats();
document.body.appendChild(stats.dom)

const gui = new GUI({ name: 'Yeet Controls' });

const cubes = [
  Cube({ color: 0x000088, x: -2, idx: 0 }, gui).cube,
  Cube({ color: 0x880000, x: 0, idx: 1 }, gui).cube,
  Cube({ color: 0x008800, x: 2, idx: 2 }, gui).cube,
];
const { grid } = Grid();
const { light, lightHelper } = Light();

const { plane } = Plane({}, gui);
const { sphere, options } = Sphere({}, gui);

[
  ...cubes,
  grid,
  light,
  lightHelper,
  plane,
  sphere
].map(m => scene.add(m));

const ambientLight = new AmbientLight(0x333333);
scene.add(ambientLight)

// scene.fog = new Fog(0xFFFFFF, 0, 200);
// scene.fog = new FogExp2(0xFFFFFF, 0.01);

const pointer = new Vector2();

window.addEventListener('click', mouseClick);

const rayCaster = new Raycaster();

let step = 0;
function render(time) {
  time *= 0.001;  // convert time to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  step += options.speed
  sphere.position.y = 50 * Math.abs(Math.sin(step));

  rayCaster.setFromCamera(pointer, camera);

  renderer.render(scene, camera);

  stats.update();
}

renderer.setAnimationLoop(render)

function mouseClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

  rayCaster.intersectObjects(scene.children).forEach(v => {
    if (sphere.id === v.object.id) {
      v.object.material.color.set(0xFF0000)
    }
  });
}