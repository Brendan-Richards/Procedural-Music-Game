
interface position {
    x: number;
    y: number;
}


class Player{

    characterShapes: VertexInformation;
    playerCanJump: boolean;
    CTRLDown: boolean;
    playerObject: Phaser.Physics.Matter.Sprite;
    playerBody: Phaser.Types.Physics.Matter.MatterBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    controlConfig: controlConfig;
    setFlatSlide: boolean;
    ledgePosition: object;
    downControl: control;
    leftControl: control;
    rightControl: control;
    playerRampSliding: boolean;
    playerFlatSliding: boolean;
    playerWallSliding: boolean;
    playerWallJumping: boolean;
    staminaActive: boolean;
    swordCollided: boolean;
    losingStamina: boolean;
    gainingStamina: boolean;
    resetWallSlide: boolean;
    playerIceWallSliding: boolean;
    flatSlideStartTime: number;
    playerLastOnGroundTime: number;
    playerGroundSlideDirection: string;
    wallJumpOffPosition: position;
    prevJumpTime: number;
    stopWallSlidingPosition: position;
    stopWallSlidingDirection: string;
    playerScaleFactor: number;
    playerSpeed: number;
    swordAttacks: Array<string>;
    meeleeAttacks: Array<string>;
    equippedWeapon: string;
    weaponsFound: Array<string>;
    lastAttackTime: number;
    staminaOutline: Phaser.GameObjects.Image;
    staminaFill: Phaser.GameObjects.Image;
    playerJumpHeight: number;
    staminaLossRate: number;
    staminaRegenRate: number;
    prevSwordSwing: string;
    playerLedgeClimb: boolean;
    playerAttacking: boolean;
    attackDown: boolean;
    stamina: number;
    playerSwordOut: boolean;
    inContactWithWall: boolean;
    downAttack: boolean;
    playerLedgeGrab: boolean;
    playerWallJumpHeight: number;
    attackReboundDistance: number;
    playerIceJumpHeight: number;
    playerFriction: number;
    changedWeapon : boolean;
    attackStaminaPenalty: number;
    playerLastOnWallTime: number;
    currentPlayerAnimation: string;
    wallCollisionDirection: string;
    prevPlayerAnimation: string;
    currentPlayerDirection: string;
    prevPlayerDirection: string;
    playerKick: boolean;
    playerMaxSpeed: number;
    lastLandingTime: number;
    bowRelease: boolean;
    bowAttacks: Array<string>;
    prevMeeleeAttack: string;
    prevEquippedWeapon: string;
    minTimeBetweenWeaponChanges: number;
    lastWeaponChangeTime: number;
    arrowSpeed: number;
    heavyAttack: boolean;
    magicType: 'red' | 'blue';
    mana: number;
    magicAttacks: Array<string>;
    casts: Array<string>;
    stopCasting: boolean;
    castFinished: boolean;
    holdingCast: boolean;
    magicSpeed: number;
    madeMagic: boolean;
    arrowScale: number;


	constructor(){
        

        //set up player
        this.playerScaleFactor = 1.6;
        this.playerSpeed = 6;
        this.playerJumpHeight = 12;
        this.playerWallJumpHeight = -2.5*this.playerSpeed;
        this.playerFriction = 0;
        this.playerMaxSpeed = 10;
        this.playerIceJumpHeight = -1.5*this.playerSpeed;
        this.ledgePosition = {};
        this.stamina = 100;
        //units of pixels per second of climbing
        this.staminaLossRate = -0.1;
        this.staminaRegenRate = 1.5;
        this.staminaOutline = null;
        this.staminaFill = null;
        this.playerLastOnWallTime = -1;
        this.lastAttackTime = -1;
        this.attackStaminaPenalty = 10;
        this.attackReboundDistance = 15;
        this.minTimeBetweenWeaponChanges = 300; // in milliseconds
        this.lastWeaponChangeTime = 0;
        this.prevSwordSwing = '';
        this.prevMeeleeAttack = '';
        this.swordAttacks = ['idleSwing1', 'idleSwing2', 'runSwing', 'airSwing1', 'airSwing2', 'wallSwing'];
        this.bowAttacks = ['idleNotch', 'idleHoldLoop', 'idleRelease', 'runNotch', 'runHoldLoop', 'runRelease', 'jumpNotch', 'jumpHoldLoop', 'jumpRelease', 'fallNotch', 'fallHoldLoop', 'fallRelease'];
        this.meeleeAttacks = ['punch1', 'punch2', 'punch3', 'runPunch', 'groundKick', 'airKick'];
        this.magicAttacks = ['idleCastRed','runCastRed','jumpCastRed','fallCastRed','wallSlideCastRed','idleCastBlue','runCastBlue','jumpCastBlue','fallCastBlue','wallSlideCastBlue'];
        this.casts = ['idleCastRed','runCastRed','jumpCastRed','fallCastRed','wallSlideCastRed','idleCastBlue','runCastBlue','jumpCastBlue','fallCastBlue','wallSlideCastBlue'];
        this.equippedWeapon = 'none';
        this.prevEquippedWeapon = '';
        this.weaponsFound = ['none', 'sword', 'bow', 'glove'];
        this.arrowSpeed = 20;
        this.magicSpeed = 15;
        this.mana = 100;
        this.madeMagic = false;
        this.magicType = 'red';
        this.arrowScale = 1;


        //flags
        this.playerCanJump = true;
        this.CTRLDown = false;
        this.setFlatSlide = false;
        this.playerRampSliding = false;
        this.playerFlatSliding = false;
        this.playerWallSliding = false;
        this.playerWallJumping = false;
        this.playerLedgeGrab = false;
        this.playerIceWallSliding = false;
        this.playerLedgeClimb = false;
        this.resetWallSlide = false;
        this.losingStamina = false;
        this.gainingStamina = false;
        this.staminaActive = false;
        this.playerAttacking = false;
        this.inContactWithWall = false;
        this.downAttack = false;
        this.swordCollided = false;
        this.changedWeapon = false;
        this.playerKick = false;
        this.bowRelease = false;
        this.heavyAttack = false;
        this.stopCasting = false;
        this.holdingCast = false;
        this.wallCollisionDirection = '';

        //movement logic
        this.flatSlideStartTime = -1;
        this.playerLastOnGroundTime = -1;
        this.playerGroundSlideDirection = '';
        this.wallJumpOffPosition = {x:0, y:0};
        this.prevJumpTime = -1;
        this.stopWallSlidingPosition = {x:0, y:0};
        this.stopWallSlidingDirection = '';
        this.currentPlayerAnimation = 'idle1';
        this.prevPlayerAnimation = '';
        this.currentPlayerDirection = 'right'
        this.prevPlayerDirection = '';
        this.lastLandingTime = -1;
        
	}    

}