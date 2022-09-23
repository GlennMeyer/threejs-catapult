import {
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three';

export function Plane(opts = {}, gui) {
  const options = {
    ...{
      castShadow: true,
      color: 0xFFFFFF,
      height: 30,
      receiveShadow: true,
      scaleScalar: 1,
      side: DoubleSide,
      width: 30,
      x: 0,
      y: 0,
      z: 0
    },
    ...opts
  };
  const planeGeometry = new PlaneGeometry(options.width, options.height)
  const planeMaterial = new MeshStandardMaterial({ color: options.color, side: options.side })
  const plane = new Mesh(planeGeometry, planeMaterial)

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(options.x, options.y, options.z)
  plane.receiveShadow = options.receiveShadow;

  if (gui) {
    const folder = gui.addFolder('Plane');

    folder.add(options, 'castShadow').onChange(e => {
      plane.castShadow = e;
    });
    folder.addColor(options, 'color').onChange(e => {
      plane.material.color.set(e);
    });
    folder.add(options, 'scaleScalar', 0, 10, .1).onChange(e => {
      plane.scale.setScalar(e);
    });
    folder.add(options, 'receiveShadow').onChange(e => {
      plane.receiveShadow = e;
    });
    folder.add(options, 'x', -50, 50, .1).onChange(e => {
      plane.position.x = e;
    });
    folder.add(options, 'y', -50, 50, .1).onChange(e => {
      plane.position.y = e;
    });
    folder.add(options, 'z', -50, 50, .1).onChange(e => {
      plane.position.z = e;
    });
  }

  return { plane, options };
}