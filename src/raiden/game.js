import {
  AmbientLight,
  Color,
  DoubleSide,
  Fog,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from 'three';

const canvas = document.querySelector('#c');
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

const scene = new Scene();

let cameraHeight = 25;
const dimension = 200;
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const fogColor = new Color(0xD3D3D3);
scene.background = fogColor;
scene.fog = new Fog(fogColor, dimension, dimension * 3);

const ambientLight = new AmbientLight(0x333333);
scene.add(ambientLight)

const sphere = new Mesh(
  new SphereGeometry(4, 32, 16),
  new MeshPhongMaterial({ color: 0x0000FF })
);
sphere.castShadow = true;
sphere.position.y = 4;
scene.add(sphere);

const light = new SpotLight(0xffffff, .75);
light.position.set(0, dimension * 1.5, 0);
light.castShadow = true;
scene.add(light);

const queue = [];

const createPlane = () => {
  const plane = new Mesh(
    new PlaneGeometry(dimension * 2, dimension),
    new MeshStandardMaterial({ color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), side: DoubleSide })
  );

  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  scene.add(plane);
  plane.position.set(0, 0, queue.length - 1 >= 0 ? queue[queue.length - 1].position.z - dimension : 0.0);

  return plane;
}

for (let i = 0; i <= 6; i++) { queue.push(createPlane()); }

let speed = 1.0;
const animate = (_time) => {
  const [head] = queue;

  if (head.position.z >= dimension * 2) {
    let plane = createPlane()
    scene.remove(queue.shift());
    queue.push(plane);
  }

  queue.map(p => p.position.set(0, 0, p.position.z + speed));

  camera.position.set(0, cameraHeight, dimension / 4);
  camera.lookAt(new Vector3(sphere.position.x, sphere.position.y, sphere.position.z));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener('keydown', ({ key }) => {

  switch (key) {
    case 'w':
      if (speed < 5.0) speed += .1
      if (sphere.position.z > -dimension / 2) {
        sphere.position.z -= speed
      }
      break;
    case 's':
      if (speed >= 1.0) speed -= .1
      if (sphere.position.z < dimension / 50) {
        sphere.position.z += speed
      }
      break;
    case 'a':
      if (sphere.position.x > -dimension / 2) {
        sphere.position.x -= speed;
      }
      break;
    case 'd':
      if (sphere.position.x < dimension / 2) {
        sphere.position.x += speed;
      }
      break;
    case ' ':
      if (sphere.position.y < 40.0) {
        sphere.position.y += 0.5;
        cameraHeight += 0.5;
      }
      break;
    case 'Control':
      if (sphere.position.y > 4.0) {
        sphere.position.y -= 0.5;
        cameraHeight -= 0.5;
      }
      break;
  }
})

animate();