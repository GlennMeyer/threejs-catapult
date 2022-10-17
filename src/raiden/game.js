import {
  AmbientLight,
  Box3,
  BoxGeometry,
  ConeGeometry,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Sphere,
  SphereGeometry,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from 'three';

const HEALTH_COLORS = [
  0xFF0000,
  0xFFA700,
  0xFFF400,
  0xA3FF00,
  0x2CBA00,
  0x00FF00
];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

const canvas = document.querySelector('#c');
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

const scene = new Scene();

let cameraHeight = 25;
const dimension = 200;
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const ambientLight = new AmbientLight(0x333333);
scene.add(ambientLight)

const player = new Mesh(
  new ConeGeometry(5, 20, 3),
  new MeshPhongMaterial({ color: 0x0000FF }),
);

player.castShadow = true;
player.position.y = 4;
player.rotation.x = -0.5 * Math.PI;

scene.add(player);

const light = new SpotLight(0xffffff, .75);
light.position.set(0, dimension * 1.5, 0);
light.castShadow = true;
scene.add(light);

const createEnemy = () => {
  let health = 5;
  const mesh = new Mesh(
    new SphereGeometry(5, 5, 5),
    new MeshPhongMaterial({ color: HEALTH_COLORS[health] }),
  );
  mesh.position.set(
    Math.random() * (dimension - -dimension) + -dimension,
    Math.random() * (40 - 4) + 4,
    -1000);
  const hitbox = new Sphere(mesh.position, mesh.geometry.radius);
  mesh.castShadow = true;
  scene.add(mesh);

  return {
    mesh,
    health,
    hitbox,
    type: 'a'
  }
}
let enemy = createEnemy();

const createTank = () => {
  let health = 5;
  const mesh = new Mesh(
    new BoxGeometry(10, 10, 10),
    new MeshPhongMaterial({ color: HEALTH_COLORS[health] }),
  );
  mesh.position.set(
    Math.random() * (dimension - -dimension) + -dimension,
    5,
    -1000);
  const hitbox = new Box3();
  hitbox.setFromObject(mesh);
  mesh.castShadow = true;
  scene.add(mesh);

  return {
    mesh,
    health,
    hitbox,
    type: 'g'
  }
};
let tank = createTank();
const queue = [];

const createPlane = () => {
  const plane = new Mesh(
    new PlaneGeometry(dimension * 2, dimension),
    new MeshStandardMaterial({ color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), side: DoubleSide }),
  );

  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  scene.add(plane);
  plane.position.set(0, 0, queue.length ? queue[queue.length - 1].position.z - dimension : 0.0);

  return plane;
}

for (let i = 0; i <= 6; i++) { queue.push(createPlane()); }

window.addEventListener('keydown', (e) => { dict[e.key.toLocaleLowerCase()] = 1; e.preventDefault(); });

let xSpeed = 0.1;
let ySpeed = 0.1;

window.addEventListener('keyup', ({ key }) => {
  key = key.toLocaleLowerCase()
  dict[key] = 0;

  switch (key) {
    case 'a':
    case 'd':
      xSpeed = .1;
      break;
    case 'w':
    case 's':
      ySpeed = .1;
      break;
  }
});

const bullets = [];
const dict = {
  a: 0,
  s: 0,
  d: 0,
  w: 0,
  control: 0,
  shift: 0,
  ' ': 0,
};

let zSpeed = 0.5;
let prevTime = -1;
const enemySpeed = 1.5;

const playerInteraction = (time) => {
  const fireRate = Math.floor(time / 250);
  const canFire = fireRate > prevTime;
  prevTime = fireRate;

  if (dict.shift && player.position.z > -dimension / 2) {
    if (zSpeed < 5.0) zSpeed += .01;
    player.position.z -= zSpeed;
  }
  if (dict.control && player.position.z < 0) {
    if (zSpeed >= 0.5) zSpeed -= .01;
    player.position.z += zSpeed;
  }
  if (dict.a && player.position.x > -dimension) {
    xSpeed += .01;
    player.position.x -= xSpeed;
  }
  if (dict.d && player.position.x < dimension) {
    xSpeed += .01;
    player.position.x += xSpeed;
  }
  if (dict.w && player.position.y < 40.0) {
    ySpeed += .01;
    player.position.y += ySpeed;
    // cameraHeight += 0.5;
  }
  if (dict.s && player.position.y > 5.0) {
    ySpeed += .01;
    player.position.y -= ySpeed;
    // cameraHeight -= 0.5;
  }
  if (dict[' '] && canFire) {
    const bullet = new Mesh(
      new SphereGeometry(1, 1, 1),
      new MeshPhongMaterial({ color: 0xFFFFFF }),
    );
    bullet.position.y = 4;
    bullet.position.set(
      player.position.x,
      player.position.y,
      player.position.z - 5,
    );
    bullet.castShadow = true;
    const bulletSphere = new Sphere(bullet.position, bullet.geometry.parameters.radius);
    bullets.push([bullet, bulletSphere]);
    scene.add(bullet);
  }
}

window.addEventListener("gamepadconnected", (e) => {
  if (e.gamepad.id.slice(0, 19) !== 'Wireless Controller') return
  console.log(`"${e.gamepad.id}"`)
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

const animate = (time) => {
  const [head] = queue;

  if (head.position.z >= dimension * 2) {
    let plane = createPlane();
    scene.remove(queue.shift());
    queue.push(plane);
  }

  queue.map(p => p.position.set(0, 0, p.position.z + zSpeed));

  enemy.mesh.position.z += zSpeed * enemySpeed;
  enemy.hitbox.set(enemy.mesh.position, enemy.mesh.geometry.parameters.radius);
  tank.mesh.position.z += zSpeed * enemySpeed;
  tank.hitbox.setFromObject(tank.mesh);
  if (enemy.mesh.position.z > 100) { scene.remove(enemy.mesh); enemy = createEnemy(); }
  if (tank.mesh.position.z > 100) { scene.remove(tank.mesh); tank = createTank(); }

  playerInteraction(time);

  bullets.map(([b, s], i) => {
    b.position.z -= (5 * zSpeed);
    s.set(b.position, b.geometry.parameters.radius);
    [tank, enemy].forEach(e => {
      if (e.hitbox.intersectsSphere(s)) {
        console.log('collision with => ', e)
        scene.remove(b);
        s.makeEmpty();
        bullets.splice(i, 1);
        e.health -= 1;
        e.mesh.material.color.setHex(HEALTH_COLORS[e.health]);
        if (e.health === -1) {
          scene.remove(e.mesh);
          e.hitbox.makeEmpty();
          if (e.type === 'a') enemy = createEnemy()
          if (e.type === 'g') tank = createTank()
        }
      }
    });
  });
  const [firstBullet] = bullets;
  const isOutOfRange = firstBullet && firstBullet[0]?.position?.z < -1000;
  if (isOutOfRange) { scene.remove(bullets.shift()[0]); }

  camera.position.set(player.position.x, player.position.y + cameraHeight, 50);
  camera.lookAt(new Vector3(player.position.x, player.position.y, player.position.z));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

fetch(location + 'api/quotations').then(res => { console.log(res.json()) })