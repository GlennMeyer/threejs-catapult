import {
  SpotLight,
  SpotLightHelper
} from 'three';

export function Light() {
  const options = {
    angle: 0.2,
    castShadow: true,
    color: 0xFFFFFF,
    x: -100,
    y: 100,
    z: 0,
  };

  const light = new SpotLight(options.color);
  light.position.set(options.x, options.y, options.z);
  light.castShadow = options.castShadow;
  light.angle = options.angle;

  const lightHelper = new SpotLightHelper(light);

  return { light, lightHelper, options };
}
