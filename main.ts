import { Engine, Scene } from "@babylonjs/core";
import { SceneManager } from "./src/scenes/SceneManger";
import Emitter from "./src/services/emitter";

const canvas = document.getElementById("app") as HTMLCanvasElement;

if (!canvas) throw new Error("Canvas not found");

async function init(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    alpha: true,
    antialias: true,
    audioEngine: true,
  });

  const Manager = new SceneManager(engine);

  Emitter.on("sceneChange", ([sceneNumber, scene]: [number, Scene]) => {
    if (scene) scene.dispose();
    Manager.switchToScene(sceneNumber);
  });

  engine.runRenderLoop(() => {
    Manager.currentScene.render();
  });
}

init(canvas).catch((e) => console.log(e));
