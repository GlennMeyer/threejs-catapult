import {
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
} from 'three';

export function Sphere(opts = {}, gui) {
  const options = {
    ...{
      castShadow: true,
      color: 0x0000FF,
      height: 16,
      radius: 4,
      receiveShadow: false,
      scaleScalar: 1,
      speed: 0.01,
      width: 32,
      wireframe: false,
      x: -10,
      y: 0,
      z: -10
    },
    ...opts
  };
  const geo = new SphereGeometry(options.radius, options.width, options.height);
  const mat = new MeshPhongMaterial({ color: options.color, wireframe: options.wireframe });
  const sphere = new Mesh(geo, mat);

  sphere.position.set(options.x, options.y, options.z)
  sphere.castShadow = options.castShadow;
  sphere.receiveShadow = options.receiveShadow;

  if (gui) {
    const folder = gui.addFolder('Sphere');

    folder.add(options, 'castShadow').onChange(e => {
      sphere.castShadow = e;
    });
    folder.addColor(options, 'color').onChange(e => {
      sphere.material.color.set(e);
    });
    folder.add(options, 'scaleScalar', 0, 10, .1).onChange(e => {
      sphere.scale.setScalar(e);
    });
    folder.add(options, 'receiveShadow').onChange(e => {
      sphere.receiveShadow = e;
    });
    folder.add(options, 'speed', 0, 0.1, 0.01);
    folder.add(options, 'wireframe').onChange(e => {
      sphere.material.wireframe = e;
    });
    folder.add(options, 'x', -15, 15, .1).onChange(e => {
      sphere.position.x = e;
    });
    // folder.add(options, 'y', -15, 15, .1).onChange(e => {
    //   sphere.position.y = e;
    // }); currently mutated in `render`
    folder.add(options, 'z', -15, 15, .1).onChange(e => {
      sphere.position.z = e;
    });
  }

  return { sphere, options };
}