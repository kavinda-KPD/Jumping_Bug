import { _decorator, Component, Node, Vec3, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GroundScroller")
export class GroundScroller extends Component {
  @property
  scrollSpeed: number = 200;

  @property(Node)
  ground1: Node = null;

  @property(Node)
  ground2: Node = null;

  @property(Node)
  ground3: Node = null;

  private groundWidth: number = 0;

  onLoad(): void {
    // Get the width of the ground (assuming all grounds have the same width)
    if (this.ground1) {
      const transform = this.ground1.getComponent(UITransform);
      if (transform) {
        this.groundWidth = transform.width;
      }
    }

    // Position the grounds in sequence
    if (this.ground1 && this.ground2 && this.ground3) {
      const ground1Pos = this.ground1.getPosition();

      // Position ground2 right after ground1
      this.ground2.setPosition(
        new Vec3(ground1Pos.x + this.groundWidth, ground1Pos.y, ground1Pos.z)
      );

      // Position ground3 right after ground2
      this.ground3.setPosition(
        new Vec3(
          ground1Pos.x + this.groundWidth * 2,
          ground1Pos.y,
          ground1Pos.z
        )
      );
    }
  }

  update(deltaTime: number): void {
    if (!this.ground1 || !this.ground2 || !this.ground3) return;

    // Move all grounds to the left
    const moveAmount = this.scrollSpeed * deltaTime;

    // Move ground1
    const ground1Pos = this.ground1.getPosition();
    this.ground1.setPosition(
      new Vec3(ground1Pos.x - moveAmount, ground1Pos.y, ground1Pos.z)
    );

    // Move ground2
    const ground2Pos = this.ground2.getPosition();
    this.ground2.setPosition(
      new Vec3(ground2Pos.x - moveAmount, ground2Pos.y, ground2Pos.z)
    );

    // Move ground3
    const ground3Pos = this.ground3.getPosition();
    this.ground3.setPosition(
      new Vec3(ground3Pos.x - moveAmount, ground3Pos.y, ground3Pos.z)
    );

    // Check if ground1 has moved completely off screen
    if (ground1Pos.x + this.groundWidth < -this.groundWidth) {
      // Find the rightmost ground and position ground1 after it
      const positions = [
        this.ground1.getPosition().x,
        this.ground2.getPosition().x,
        this.ground3.getPosition().x,
      ];
      const rightmostX = Math.max(...positions);

      this.ground1.setPosition(
        new Vec3(rightmostX + this.groundWidth, ground1Pos.y, ground1Pos.z)
      );
    }

    // Check if ground2 has moved completely off screen
    if (ground2Pos.x + this.groundWidth < -this.groundWidth) {
      // Find the rightmost ground and position ground2 after it
      const positions = [
        this.ground1.getPosition().x,
        this.ground2.getPosition().x,
        this.ground3.getPosition().x,
      ];
      const rightmostX = Math.max(...positions);

      this.ground2.setPosition(
        new Vec3(rightmostX + this.groundWidth, ground2Pos.y, ground2Pos.z)
      );
    }

    // Check if ground3 has moved completely off screen
    if (ground3Pos.x + this.groundWidth < -this.groundWidth) {
      // Find the rightmost ground and position ground3 after it
      const positions = [
        this.ground1.getPosition().x,
        this.ground2.getPosition().x,
        this.ground3.getPosition().x,
      ];
      const rightmostX = Math.max(...positions);

      this.ground3.setPosition(
        new Vec3(rightmostX + this.groundWidth, ground3Pos.y, ground3Pos.z)
      );
    }
  }
}
