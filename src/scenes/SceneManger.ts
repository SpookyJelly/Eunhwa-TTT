import { Scene, Engine } from "@babylonjs/core";
import { SceneNo } from "../constants";
import { mainScene } from "./mainScene";

export class SceneManager {
  #currnetScene: Scene;
  #engine: Engine;

  constructor(engine: Engine) {
    this.#engine = engine;
    this.#currnetScene = mainScene(engine); // fix it later
  }

  switchToScene(sceneNumber: number) {
    switch (sceneNumber) {
      case SceneNo.main:
        this.#currnetScene = mainScene(this.#engine);
        break;

      default:
        break;
    }
  }

  get currentScene() {
    return this.#currnetScene;
  }
  set currentScene(scene: Scene) {
    this.#currnetScene = scene;
  }
}
