import {
  _decorator,
  Component,
  Node,
  Tween,
  tween,
  Vec3,
  input,
  Input,
  KeyCode,
  view,
  UITransform,
  sys,
  director,
  game,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  @property
  moveSpeed: number = 200;

  @property
  jumpHeight: number = 100;

  @property
  jumpDuration: number = 0.5;

  private isJumping: boolean = false;
  private moveDirection: number = 0;
  private isShiftPressed: boolean = false;

  onLoad(): void {
    // Register input events
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  onDestroy(): void {
    // Unregister input events
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  private onKeyDown(event: any): void {
    switch (event.keyCode) {
      case KeyCode.ARROW_RIGHT:
      case KeyCode.KEY_D:
        this.moveDirection = 1;
        break;
      case KeyCode.ARROW_LEFT:
      case KeyCode.KEY_A:
        this.moveDirection = -1;
        break;
      case KeyCode.SHIFT_LEFT:
      case KeyCode.SHIFT_RIGHT:
        this.isShiftPressed = true;
        break;
      case KeyCode.SPACE:
        this.jump();
        break;
    }
  }

  private onKeyUp(event: any): void {
    if (
      event.keyCode === KeyCode.ARROW_RIGHT ||
      event.keyCode === KeyCode.KEY_D ||
      event.keyCode === KeyCode.ARROW_LEFT ||
      event.keyCode === KeyCode.KEY_A
    ) {
      this.moveDirection = 0;
    }
    if (
      event.keyCode === KeyCode.SHIFT_LEFT ||
      event.keyCode === KeyCode.SHIFT_RIGHT
    ) {
      this.isShiftPressed = false;
    }
  }

  private jump() {
    if (this.isJumping) return;

    this.isJumping = true;
    const startY = this.node.position.y;

    // Calculate jump height based on shift key
    const finalJumpHeight = this.isShiftPressed
      ? this.jumpHeight * 2
      : this.jumpHeight;

    tween(this.node)
      .to(
        this.jumpDuration / 2,
        {
          position: new Vec3(
            this.node.position.x,
            startY + finalJumpHeight,
            this.node.position.z
          ),
        },
        { easing: "smooth" }
      )
      .to(
        this.jumpDuration / 2,
        {
          position: new Vec3(
            this.node.position.x,
            startY,
            this.node.position.z
          ),
        },
        { easing: "smooth" }
      )
      .call(() => {
        this.isJumping = false;
      })
      .start();
  }

  update(deltaTime: number): void {
    if (this.moveDirection !== 0) {
      // Calculate movement
      const moveAmount = this.moveSpeed * deltaTime * this.moveDirection;
      const newX = this.node.position.x + moveAmount;

      // Update position
      this.node.setPosition(
        new Vec3(newX, this.node.position.y, this.node.position.z)
      );
    }
  }
}
