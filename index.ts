import { Engine, Scene } from "@babylonjs/core";
import { SceneManager } from "./src/scenes/SceneManger";
import Emitter from "./src/services/emitter";
import { initUI } from "./main";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("No canvas found");
}

async function init(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true);
  const Manager = new SceneManager(engine);
  initUI(Manager.currentScene);

  Emitter.on("sceneChange", ([sceneNumber, scene]: [number, Scene]) => {
    if (scene) scene.dispose();
    Manager.switchToScene(sceneNumber);
  });
  engine.runRenderLoop(() => {
    Manager.currentScene.render();
  });
}

init(canvas);
