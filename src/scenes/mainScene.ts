import {
  Engine,
  Scene,
  Color3,
  Color4,
  CubeTexture,
  ArcRotateCamera,
  Vector3,
  CreateBox,
  CreateGround,
  DefaultRenderingPipeline,
  StandardMaterial,
  Texture,
  Mesh,
  TransformNode,
  PBRMaterial,
  CreateTorus,
  CreateCylinder,
  ElasticEase,
  Animation,
  HemisphericLight,
} from "@babylonjs/core";
import { animationVectorArr, boxPositions } from "../constants";
import sum from "../assets/sample.jpg";
import "@babylonjs/loaders";
//import { PBRCustomMaterial} from "@babylonjs/materials";

export function mainScene(engine: Engine) {
  const canvas = engine.getRenderingCanvas();
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.2, 0.2, 0.45, 1).toLinearSpace();

  const hdrTexture = new CubeTexture(
    "https://playground.babylonjs.com/textures/environment.env",
    scene
  );

  hdrTexture.gammaSpace = false;
  scene.environmentTexture = hdrTexture;
  scene.environmentIntensity = 1;

  const camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 4,
    Math.PI / 4,
    8,
    Vector3.Zero(),
    scene
  );

  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 4;
  camera.upperRadiusLimit = 30;
  camera.wheelDeltaPercentage = 0.02;

  camera.setTarget(new Vector3(1, -1, -1));

  camera.useAutoRotationBehavior = true;

  // const box = CreateBox("box", { size: 2 }, scene);

  const pipeline = new DefaultRenderingPipeline(
    "defaultPipeline",
    true,
    scene,
    [camera]
  );

  pipeline.samples = 4;
  pipeline.fxaaEnabled = true;

  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.35;
  pipeline.bloomWeight = 0.6;
  pipeline.imageProcessing.toneMappingEnabled = true;
  pipeline.imageProcessing.toneMappingType = 1;

  // create game field

  const proto = CreateBox("proto", { size: 1 }, scene);

  const protoMaterial = new PBRMaterial("protoMaterial");
  protoMaterial.albedoColor = new Color3(0.1, 0.1, 0.89);
  protoMaterial.metallic = 0.9;
  protoMaterial.roughness = 0.15;
  protoMaterial.alpha = 1;
  proto.material = protoMaterial;
  proto.isVisible = false;

  const allBoxes = new TransformNode("allBoxes", scene);

  function putBoxes(index: number) {
    const box = proto.createInstance(`box${index}`);
    box.parent = allBoxes;
    box.position = getBoxPosition(index);
  }

  Array.from({ length: 9 }, (_, i) => i).forEach((i) => putBoxes(i));

  // create game pieces
  // symbol "O"

  const torus = CreateTorus(
    "torus",
    {
      thickness: 0.2,
      diameter: 0.75,
      tessellation: 64,
    },
    scene // diff
  );

  const torusMaterial = new PBRMaterial("torusMaterial");
  torusMaterial.albedoColor = new Color3(0.98, 0.02, 0.12);
  torusMaterial.metallic = 1;
  torusMaterial.roughness = 0.6;
  torus.material = torusMaterial;
  torus.isVisible = false;

  // symbol "X"
  const cylinder = CreateCylinder(
    "cylinder",
    {
      height: 1,
      diameter: 0.2,
    },
    scene
  );

  const newCylinder = cylinder.clone();
  newCylinder.rotation.x = -Math.PI / 2;

  const cross = Mesh.MergeMeshes([cylinder, newCylinder], true)! as Mesh;
  cross.rotation = new Vector3(0, Math.PI / 4, -Math.PI / 2);
  cross.position.y = 0.1;
  cross.name = "cross";

  const crossMaterial = new PBRMaterial("crossMaterial");
  crossMaterial.albedoColor = new Color3(0.2, 0.9, 0.3);
  crossMaterial.metallic = 1;
  crossMaterial.roughness = 0.25;
  cross.material = crossMaterial;
  cross.isVisible = false;

  let osillations = 2;
  let springiness = 0.005;

  const easingFn = new ElasticEase(osillations, springiness);

  easingFn.setEasingMode(ElasticEase.EASINGMODE_EASEINOUT);

  const shoot = (
    mesh: Mesh,
    fRate: number,
    fTotal: number,
    startPos: Vector3,
    endPos: any
  ) => {
    Animation.CreateAndStartAnimation(
      "shoot",
      mesh,
      "position",
      fRate,
      fTotal,
      startPos,
      endPos,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      easingFn
    );
  };

  boxPositions.forEach((_, index: number) => {
    const mesh = scene.getMeshByName(`box${index}`) as Mesh;
    shoot(mesh, 60, 120, animationVectorArr[index], mesh.position);
  });

  const ground = CreateGround("ground", { width: 3, height: 3 }, scene);

  const groundMat = new StandardMaterial("ground", scene);

  //const groundMat = new PBRMaterial("ground", scene);
  groundMat.ambientTexture = new Texture(sum, scene);
  // groundMat.specularColor = new Color3(0, 0, 0);

  ground.position.x = 1.1;
  ground.position.y = 0.9;
  ground.position.z = -1.1;
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  ground.material = groundMat;
  ground.visibility = 0.5;

  return scene;
}

function getBoxPosition(order: number) {
  return new Vector3(
    boxPositions[order][0],
    boxPositions[order][1],
    boxPositions[order][2]
  );
}
