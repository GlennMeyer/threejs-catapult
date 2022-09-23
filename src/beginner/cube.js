import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
} from 'three';

export function Cube(opts = {}, gui) {
  const options = {
    ...{
      castShadow: true,
      depth: 1,
      height: 1,
      receiveShadow: false,
      scaleScalar: 1,
      width: 1,
      x: 0,
      y: 5,
      z: 0
    },
    ...opts
  };
  const geometry = new BoxGeometry(options.width, options.height, options.depth);
  const material = new MeshPhongMaterial({ color: options.color });
  const cube = new Mesh(geometry, material);

  cube.position.x = options.x;
  cube.position.y = options.y;
  cube.castShadow = true;

  if (gui) {
    const folder = gui.addFolder(`Cube ${options.idx}`);

    folder.add(options, 'castShadow').onChange(e => {
      cube.castShadow = e;
    });
    folder.addColor(options, 'color').onChange(e => {
      cube.material.color.set(e);
    });
    folder.add(options, 'scaleScalar', 0, 10, .1).onChange(e => {
      cube.scale.setScalar(e);
    });
    folder.add(options, 'receiveShadow').onChange(e => {
      cube.receiveShadow = e;
    });
    folder.add(options, 'x', -20, 20, .1).onChange(e => {
      cube.position.x = e;
    });
    folder.add(options, 'y', -20, 20, .1).onChange(e => {
      cube.position.y = e;
    });
    folder.add(options, 'z', -20, 20, .1).onChange(e => {
      cube.position.z = e;
    });
  }

  return { cube, options };
}