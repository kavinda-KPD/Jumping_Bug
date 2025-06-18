import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StarCountScript")
export class StarCountScript extends Component {
  @property(Label)
  starCountLabel: Label = null;

  starCount: number = 0;

  start() {}

  update(deltaTime: number) {
    this.calculateStarCount("add");
  }

  calculateStarCount(method: "add" | "subtract") {
    if (method === "add") {
      this.starCount++;
    } else {
      this.starCount--;
    }

    this.starCountLabel.string = "Stars: " + this.starCount.toString();
  }

  showStarCountLabel() {
    this.starCountLabel.node.active = true;
  }

  hideStarCountLabel() {
    this.starCountLabel.node.active = false;
  }
}
