import { GridHelper } from 'three';

export function Grid() {
  const options = {
    divisions: 30,
    size: 30,
  }

  const grid = new GridHelper(options.size, options.divisions)

  return { grid, options };
}