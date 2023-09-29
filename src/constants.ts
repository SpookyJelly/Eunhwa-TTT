import { Vector3 } from "@babylonjs/core";
export enum SceneNo {
  "main" = 0,
}

export const boxPositions = [
  [0, 0, 0],
  [1.1, 0, 0],
  [2.2, 0, 0],
  [0, 0, -1.1],
  [1.1, 0, -1.1],
  [2.2, 0, -1.1],
  [0, 0, -2.2],
  [1.1, 0, -2.2],
  [2.2, 0, -2.2],
];

export const animationVectorArr = [
  new Vector3(0, 0, 0),
  new Vector3(2.2, 0, 0),
  new Vector3(4.4, 0, 0),
  new Vector3(0, 0, -2.2),
  new Vector3(2.2, 0, -2.2),
  new Vector3(4.4, 0, -2.2),
  new Vector3(0, 0, -4.4),
  new Vector3(2.2, 0, -4.4),
  new Vector3(4.4, 0, -4.4),
];
