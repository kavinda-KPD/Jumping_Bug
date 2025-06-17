import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Ground")
export class Ground extends Component {
  @property(Node)
  ground1: Node = null;

  @property(Node)
  ground2: Node = null;

  
  start() {}

  update(deltaTime: number) {}
}
