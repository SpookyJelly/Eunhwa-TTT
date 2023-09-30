import { TTTGraph } from "./src/TTT/TTTGraph";

class GraphContext {
  static #instance: GraphContext;

  #graph: TTTGraph;
  #currentPlayer: number;

  private constructor() {}

  public set startingPlayer(player: number) {
    this.#graph = new TTTGraph(player);
  }

  public static get Instance() {
    return this.#instance || (this.#instance = new this());
  }

  public get graph() {
    return this.#graph;
  }
  public get currentPlayer() {
    return this.#currentPlayer;
  }
  public set currentPlayer(player: number) {
    this.#currentPlayer = player;
    this.#graph.currentPlayer = player;
  }
}

export default GraphContext.Instance;
