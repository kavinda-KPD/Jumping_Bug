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
  Animation,
  AnimationClip,
  Sprite,
  resources,
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

  @property
  idleAnimationSpeed: number = 0.5; // Slower animation speed when idle

  @property
  runningAnimationSpeed: number = 1.0; // Normal animation speed when running

  private isJumping: boolean = false;
  private moveDirection: number = 0;
  private isShiftPressed: boolean = false;
  private animation: Animation | null = null;
  private sprite: Sprite | null = null;
  private isMoving: boolean = false;
  private currentAnimationSpeed: number = 0.5;

  onLoad(): void {
    // Register input events
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    // Get the animation component
    this.animation = this.getComponent(Animation);
    this.sprite = this.getComponent(Sprite);

    // If no animation component exists, add one
    if (!this.animation) {
      this.animation = this.addComponent(Animation);
    }

    // Load and set up the running animation
    this.setupRunningAnimation();
  }

  onDestroy(): void {
    // Unregister input events
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);

    // Clean up animation
    if (this.animation) {
      this.animation.stop();
    }
  }

  private setupRunningAnimation(): void {
    // Load the running animation clip
    resources.load(
      "Animations/Monster/monster-running.animation",
      AnimationClip,
      (err, clip) => {
        if (err) {
          console.error("Failed to load monster running animation:", err);
          return;
        }

        // Set the clips array for the animation component
        this.animation!.clips = [clip];

        // Set the default clip
        this.animation!.defaultClip = clip;

        // Start the idle running animation immediately
        this.startIdleAnimation();
      }
    );
  }

  private startIdleAnimation(): void {
    if (this.animation && this.animation.defaultClip) {
      this.currentAnimationSpeed = this.idleAnimationSpeed;
      this.animation.defaultClip.speed = this.currentAnimationSpeed;
      this.animation.play();
    }
  }

  private playRunningAnimation(): void {
    if (this.animation && this.animation.defaultClip) {
      this.currentAnimationSpeed = this.runningAnimationSpeed;
      this.animation.defaultClip.speed = this.currentAnimationSpeed;
      this.animation.play();
    }
  }

  private stopRunningAnimation(): void {
    if (this.animation) {
      this.animation.stop();
    }
  }

  private onKeyDown(event: any): void {
    switch (event.keyCode) {
      case KeyCode.ARROW_RIGHT:
      case KeyCode.KEY_D:
        this.moveDirection = 1;
        this.startRunningAnimation();
        break;
      case KeyCode.ARROW_LEFT:
      case KeyCode.KEY_A:
        this.moveDirection = -1;
        this.startRunningAnimation();
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
      this.isMoving = false;
      this.startIdleAnimation(); // Return to idle animation instead of stopping
    }
    if (
      event.keyCode === KeyCode.SHIFT_LEFT ||
      event.keyCode === KeyCode.SHIFT_RIGHT
    ) {
      this.isShiftPressed = false;
    }
  }

  private startRunningAnimation(): void {
    if (!this.isMoving) {
      this.isMoving = true;
      this.playRunningAnimation();
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

      // Flip the sprite based on movement direction
      if (this.sprite && this.moveDirection !== 0) {
        this.sprite.node.scale = new Vec3(this.moveDirection, 1, 1);
      }
    }
  }
}
