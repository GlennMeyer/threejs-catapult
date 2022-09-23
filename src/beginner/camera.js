import { PerspectiveCamera } from 'three';

export function Camera() {
  const options = {
    aspect: 2,
    far: 1000,
    fov: 75,
    near: 0.1,
    x: -10,
    y: 30,
    z: 30,
  }

  const camera = new PerspectiveCamera(options.fov, options.aspect, options.near, options.far);
  camera.position.set(options.x, options.y, options.z)

  return { camera, options };
}