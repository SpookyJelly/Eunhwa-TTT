import {
  Scene,
  ActionManager,
  ExecuteCodeAction,
  Sound,
  Mesh,
} from "@babylonjs/core";
import { getBoxPosition } from "./src/scenes/mainScene";

import neonWinURL from "./src/assets/neon_win.mp3?url";
import neonLoseURL from "./src/assets/neon_lose.mp3?url";
import neonDrawURL from "./src/assets/neon_draw.mp3?url";
import gameStartURL from "./src/assets/game_start.mp3?url";
import graphContext from "./graphContext";
import { TTTNode } from "./src/TTT/TTTNode";

export function initUI(scene: Scene) {
  const buttons = document.querySelectorAll("#startSection button");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => onButtonClick(e, scene));
  });

  const button = document.querySelector("#endSection button")!;
  button.addEventListener("click", onRestart);

  // init cells

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) =>
    cell.addEventListener("click", (e) => onCellClick(e, scene))
  );

  const boxCells = scene.getTransformNodeByName("allBoxes")!.getChildren();

  for (let boxCell of boxCells as any) {
    boxCell.actionManager = new ActionManager(scene);
    boxCell.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, (e) => {
        onCellBoxClick(e, scene);
      })
    );
  }
}

function onButtonClick(event: Event, scene: Scene) {
  const button = event.target as HTMLButtonElement;
  const startingPlayer = parseInt(button.dataset.player!);
  initGame(scene, startingPlayer);
}

function onRestart() {
  window.location.reload();
}

function onCellBoxClick(event, scene: Scene) {
  const cellB = event.meshUnderPointer;
  const cellBid = parseInt(cellB.name);

  const isFinished = evals();
  if (!isFinished) {
    const cellid = cellBid;

    const currentPlayer = graphContext.graph.currentPlayer;
    graphContext.graph.turn(cellid, currentPlayer);

    const checkLastMove = evals();

    if (!checkLastMove) {
      graphContext.graph.aiTurn();
    }

    updateUI(scene);
  }
}

function initGame(scene: Scene, startingPlayer: number) {
  const intro = document.getElementById("intro")!;
  intro.classList.add("hidden");

  // make game state graph with starting player
  graphContext.startingPlayer = startingPlayer;

  new Sound("Music", gameStartURL, scene, null, {
    loop: false,
    autoplay: true,
  });

  // ai make move first
  if (startingPlayer === 2) {
    graphContext.graph.aiTurn();
    updateUI(scene);
  }
}

function updateUI(scene: Scene) {
  const node = graphContext.graph.getNode(
    graphContext.graph.currentNode
  ) as TTTNode;

  const board = node.board;
  const cells = document.querySelectorAll(".cell") as NodeListOf<HTMLElement>;

  function getTextName(status: number) {
    switch (status) {
      case 1:
        return ["X", "cross"];
      case 2:
        return ["O", "torus"];
      default:
        return ["", ""];
    }
  }

  for (let cell of cells) {
    const cellid = cell.dataset.cellid!;
    const status = board[cellid];
    const pickedCell = scene.getMeshByName(cell.dataset.cellid!)!;

    const [text, name] = getTextName(status);
    if (text === "" || name === "") continue;
    cell.textContent = text;
    cell.removeEventListener("click", (e) => onCellClick(e, scene));
    const mesh = scene.getMeshByName(name)! as Mesh;
    const newMesh = mesh.clone(`${name}Move`)!;
    newMesh.isVisible = true;
    newMesh.position = getBoxPosition(Number(cell.dataset.cellid));
    newMesh.position.y = 0.6;

    pickedCell.isPickable = false;
    newMesh.isPickable = false;
  }
  if (evals()) {
    const intro = document.getElementById("intro")!;
    intro.classList.remove("hidden");

    const startSection = document.getElementById("startSection")!;
    startSection.style.display = "none";

    const endSection = document.getElementById("endSection")!;
    endSection.style.display = "flex";

    const result = document.getElementById("result")!;
    const player = graphContext.currentPlayer;

    if (node.win) {
      if (node.winPlayer === player) {
        new Sound("Music", neonLoseURL, scene, null, {
          loop: false,
          autoplay: true,
        });
        result.textContent = "지휘관의 승리!";
      } else {
        result.textContent = "네온이 이겼습니다!";
        new Sound("Music", neonWinURL, scene, null, {
          loop: false,
          autoplay: true,
        });
      }
      return;
    }
    new Sound("Music", neonDrawURL, scene, null, {
      loop: false,
      autoplay: true,
    });

    result.textContent = "무승부!";
    return;
  }
}

function onCellClick(event: Event, scene: Scene) {
  const isFinished = evals();
  if (!isFinished) {
    const cell = event.target as HTMLElement;
    const cellid = cell.dataset.cellid!;

    const graph = graphContext.graph;

    graph.turn(cellid, graph.currentPlayer);
    const checkLastMove = evals();
    if (!checkLastMove) {
      graph.aiTurn();
    }

    updateUI(scene);
  }
}

function evals() {
  const graph = graphContext.graph;
  const board = graph.getNode(graph.currentNode) as TTTNode;
  if (board.win || board.finished) return true;
  return false;
}
