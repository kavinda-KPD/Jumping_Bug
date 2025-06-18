import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StarCountScript")
export class StarCountScript extends Component {
  @property(Label)
  starCountLabel: Label = null;

  @property(Label)
  HeathLifeCountLabel: Label = null;

  starCount: number = 0;
  HeathLifeCount: number = 0;

  start() {}

  update(deltaTime: number) {
    this.calculateStarCount("add");
    this.calculateHeathLifeCount("add");
  }

  calculateStarCount(method: "add" | "subtract") {
    if (method === "add") {
      this.starCount++;
    } else {
      this.starCount--;
    }

    this.starCountLabel.string = "Stars ⭐ : " + this.starCount.toString();
  }

  calculateHeathLifeCount(method: "add" | "subtract") {
    if (method === "add") {
      this.HeathLifeCount++;
    } else {
      this.HeathLifeCount--;
    }

    this.HeathLifeCountLabel.string =
      "Health🥷🏻: " + this.HeathLifeCount.toString();
  }

  showStarCountLabel() {
    this.starCountLabel.node.active = true;
    this.HeathLifeCountLabel.node.active = true;
  }

  hideStarCountLabel() {
    this.starCountLabel.node.active = false;
    this.HeathLifeCountLabel.node.active = false;
  }
}
