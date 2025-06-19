import { _decorator, Component, Node, Vec3, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackgroundScroller")
export class BackgroundScroller extends Component {
  @property
  scrollSpeed: number = 200; // Same speed as ground

  @property(Node)
  background1: Node = null;

  @property(Node)
  background2: Node = null;

  @property(Node)
  background3: Node = null;

  private backgroundWidth: number = 0;

  onLoad(): void {
    // Get the width of the background (assuming all backgrounds have the same width)
    if (this.background1) {
      const transform = this.background1.getComponent(UITransform);
      if (transform) {
        this.backgroundWidth = transform.width;
      }
    }

    // Position the backgrounds in sequence
    if (this.background1 && this.background2 && this.background3) {
      const bg1Pos = this.background1.getPosition();

      // Position background2 right after background1
      this.background2.setPosition(
        new Vec3(bg1Pos.x + this.backgroundWidth, bg1Pos.y, bg1Pos.z)
      );

      // Position background3 right after background2
      this.background3.setPosition(
        new Vec3(bg1Pos.x + this.backgroundWidth * 2, bg1Pos.y, bg1Pos.z)
      );
    }
  }

  update(deltaTime: number): void {
    if (!this.background1 || !this.background2 || !this.background3) return;

    // Move all backgrounds to the left
    const moveAmount = this.scrollSpeed * deltaTime;

    // Move background1
    const bg1Pos = this.background1.getPosition();
    this.background1.setPosition(
      new Vec3(bg1Pos.x - moveAmount, bg1Pos.y, bg1Pos.z)
    );

    // Move background2
    const bg2Pos = this.background2.getPosition();
    this.background2.setPosition(
      new Vec3(bg2Pos.x - moveAmount, bg2Pos.y, bg2Pos.z)
    );

    // Move background3
    const bg3Pos = this.background3.getPosition();
    this.background3.setPosition(
      new Vec3(bg3Pos.x - moveAmount, bg3Pos.y, bg3Pos.z)
    );

    // Check if background1 has moved completely off screen
    if (bg1Pos.x + this.backgroundWidth < -this.backgroundWidth) {
      // Find the rightmost background and position background1 after it
      const positions = [
        this.background1.getPosition().x,
        this.background2.getPosition().x,
        this.background3.getPosition().x,
      ];
      const rightmostX = Math.max(...positions);

      this.background1.setPosition(
        new Vec3(rightmostX + this.backgroundWidth, bg1Pos.y, bg1Pos.z)
      );
    }

    // Check if background2 has moved completely off screen
    if (bg2Pos.x + this.backgroundWidth < -this.backgroundWidth) {
      // Find the rightmost background and position background2 after it
      const positions = [
        this.background1.getPosition().x,
        this.background2.getPosition().x,
        this.background3.getPosition().x,
      ];
      const rightmostX = Math.max(...positions);

      this.background2.setPosition(
        new Vec3(rightmostX + this.backgroundWidth, bg2Pos.y, bg2Pos.z)
      );
    }

    // Check if background3 has moved completely off screen
    if (bg3Pos.x + this.backgroundWidth < -this.backgroundWidth) {
      // Find the rightmost background and position background3 after it
      const positions = [
        this.background1.getPosition().x,
        this.background2.getPosition().x,
        this.background3.getPosition().x,
      ];
      const rightmostX = Math.max(...positions);

      this.background3.setPosition(
        new Vec3(rightmostX + this.backgroundWidth, bg3Pos.y, bg3Pos.z)
      );
    }
  }
}
