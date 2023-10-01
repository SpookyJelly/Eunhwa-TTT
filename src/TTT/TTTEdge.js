// @author robp94 / https://github.com/robp94

import { Edge } from "yuka";

export class TTTEdge extends Edge {
  constructor(from, to, cell, player) {
    super(from, to);
    this.cell = cell;
    this.player = player;
  }
}
