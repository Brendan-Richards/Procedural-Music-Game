import Phaser, { Scene } from 'phaser';
import makeCharacterAnimations from './CharacterAnimations';
import ContentGenerator from './ContentGenerator';
import handleCollisions from './Collisions';
import handlePlayerMovement from './PlayerMovement';
import Audio from './Audio';
//import { startRNN, pauseRNN, resumeRNN } from './performanceRNN';
import 'regenerator-runtime/runtime';
//import magentaTest from './MagentaTest';

type controlConfig = {
    leftControl: control,
    rightControl: control,
    jumpControl: control,
    downControl: control,
    groundSlide: control,
    attack: control    
}

type control = {
    isUp: boolean,
    isDown: boolean
}

interface VertexInformation {
    [keyu: string]: any
}

interface position {
    x: number;
    y: number;
}


export default class MountainScene extends Phaser.Scene
{
    maxGameHeight: number;
    maxGameWidth: number;
    characterShapes: VertexInformation;
    playerCanJump: boolean;
    CTRLDown: boolean;
    timer: Date
    player: Phaser.Physics.Matter.Sprite;
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
    swordDraws: Array<string>;
    swordSheaths: Array<string>;
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
    sheathSword: boolean;
    drawSword: boolean;
    attackDown: boolean;
    swordDrawn: boolean;
    stamina: number;
    playerSwordOut: boolean;
    inContactWithWall: boolean;
    downAttack: boolean;
    playerLedgeGrab: boolean;
    playerWallJumpHeight: number;
    attackReboundDistance: number;
    playerIceJumpHeight: number;
    playerFriction: number;
    numChests: number;
    changedWeapon : boolean;
    attackStaminaPenalty: number;
    playerLastOnWallTime: number;
    chestScaleFactor: number;
    currentPlayerAnimation: string;
    wallCollisionDirection: string;
    prevPlayerAnimation: string;
    currentPlayerDirection: string;
    prevPlayerDirection: string;
    playerKick: boolean;
    playerMaxSpeed: number;
    lastLandingTime: number;
    audio: Audio;
    bowRelease: boolean;
    bg2: Phaser.GameObjects.Image;
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

    back1: Phaser.GameObjects.Image;

	constructor()
	{
        super('mountainScene');

        //this.timer = new Date();

        this.maxGameHeight = 6400;
        this.maxGameWidth = 6400;
        this.chestScaleFactor = 0.6;
        this.numChests = 5;

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
        this.swordDraws = ['idleSwordDraw', 'runSwordDraw', 'jumpSwordDraw', 'fallSwordDraw', 'wallSwordDraw', 'ledgeSwordDraw'];
        this.swordSheaths = ['idleSwordSheath', 'runSwordSheath', 'jumpSwordSheath', 'fallSwordSheath', 'wallSwordSheath', 'ledgeSwordSheath'];
        this.meeleeAttacks = ['punch1', 'punch2', 'punch3', 'runPunch', 'groundKick', 'airKick'];
        this.magicAttacks = ['idleCastRed','runCastRed','jumpCastRed','fallCastRed','wallSlideCastRed','idleCastBlue','runCastBlue','jumpCastBlue','fallCastBlue','wallSlideCastBlue'];
        this.casts = ['idleCastRed','runCastRed','jumpCastRed','fallCastRed','wallSlideCastRed','idleCastBlue','runCastBlue','jumpCastBlue','fallCastBlue','wallSlideCastBlue'];
        this.equippedWeapon = 'glove';
        this.prevEquippedWeapon = '';
        this.weaponsFound = ['none', 'sword', 'bow', 'glove'];
        this.arrowSpeed = 30;
        this.magicSpeed = 15;
        this.mana = 100;
        this.madeMagic = false;
        this.magicType = 'red';


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
        this.playerSwordOut = false;
        this.swordDrawn = true;
        this.sheathSword = false;
        this.drawSword = false;
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

    create()
    {
        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight, 64, true, true, false, true);
        this.cameras.main.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight);
        //this.cameras.main.setZoom(0.07);

        const contentGenerator = new ContentGenerator(this, this.maxGameWidth, this.maxGameHeight, 'sparse');
        contentGenerator.createLevel();

        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');
        
        this.characterShapes = this.cache.json.get('characterShapes');
        this.playerBody = this.matter.add.fromPhysicsEditor(100, this.maxGameHeight-100, this.characterShapes.adventurer_idle_00, undefined, false);    
        //console.log('player body slop value:', this.playerBody.slop);
          
        this.player.setExistingBody(this.playerBody);
        this.player.setScale(this.playerScaleFactor);

        makeCharacterAnimations(this);
        
        console.log('created character at:', this.playerBody.position);

        // this.cameras.main.setBackgroundColor('rgba(2, 63, 157, 1)');
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 1)');
        //this.cameras.main.setTint(30);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
      
        //input setup
        /////////////////////////////////////////////////////////////////////////////////
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlConfig = {
            leftControl: {
                isDown: false,
                isUp: true
            },
            rightControl: {
                isDown: false,
                isUp: true
            },
            downControl: {
                isDown: false,
                isUp: true
            },
            jumpControl: this.cursors.space as Phaser.Input.Keyboard.Key,
            groundSlide: {
                isDown: this.CTRLDown,
                isUp: !this.CTRLDown
            },
            attack: {
                isDown: this.attackDown,
                isUp: !this.attackDown
            }
        }

        this.input.mouse.disableContextMenu();
        //this.input.setDefaultCursor('none');

        this.input.on('pointerdown', (pointer) => {
            const canAttack = !this.swordAttacks.includes(this.currentPlayerAnimation) && !this.bowAttacks.includes(this.currentPlayerAnimation) && !this.playerAttacking && !this.meeleeAttacks.includes(this.currentPlayerAnimation) && !this.playerLedgeGrab; //&& !this.swordDraws.includes(this.currentPlayerAnimation) && !this.swordSheaths.includes(this.currentPlayerAnimation)
           
            if(this.equippedWeapon==='sword' && canAttack){
                if(pointer.leftButtonDown()){
                    this.playerAttacking = true;

                    if(!this.playerCanJump && this.controlConfig.downControl.isDown){
                        this.downAttack = true;
                    }
                    else{
                        this.downAttack = false;
                    }
                }
                else if(pointer.rightButtonDown()){
                    this.playerAttacking = true;
                    this.heavyAttack = true;
                }
            }
            else  if(this.equippedWeapon==='none' && canAttack){
                if(!this.playerWallSliding || (this.playerWallSliding && this.currentPlayerAnimation==='run')){
                    if(pointer.rightButtonDown()){ 
                        this.playerKick = true;
                    }
                    this.playerAttacking = true;
                }
            }
            else if(this.equippedWeapon==='bow' && canAttack && !this.playerWallSliding){
                if(pointer.leftButtonDown()){ 
                    this.playerAttacking = true; 
                    this.bowRelease = false;
                }                
            }
            if(this.equippedWeapon==='glove' && !this.playerAttacking && !this.audio.castSound.isPlaying){
                const leftButton = 0;
                const rightButton = 2;
                //console.log(pointer)
                if(pointer.button===leftButton){                   
                    this.magicType = 'red';
                    this.playerAttacking = true;
                }
                else if(pointer.button===rightButton){ 
                    this.magicType = 'blue';
                    this.playerAttacking = true;
                }  
                //console.log('current magic type:', this.magicType);                      
            }
        }, this);

        this.input.on('pointerup', (pointer) => {
            // console.log('pointer up');
            // console.log(pointer);
            const leftButton = 0;
            const rightButton = 2;
            if(this.equippedWeapon==='bow' && pointer.button===leftButton){
                this.bowRelease = true;               
            }
            // if(this.equippedWeapon==='glove'){
            //     console.log(this.player.anims);
            //     //console.log('pointer up glove');
            //     if(pointer.button===leftButton && this.magicType==='red'){
            //         //console.log('left button just released, stopping');
            //         this.holdingCast = false;
                    
            //     }
            //     else if(pointer.button===rightButton && this.magicType==='blue'){
            //         this.holdingCast = false;
            //         //console.log('right button just released, stopping');
            //     }  
            //     //console.log('current magic type:', this.magicType);             
            // }
        }, this);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            //console.log(pointer);
            if(this.time.now - this.lastWeaponChangeTime > this.minTimeBetweenWeaponChanges &&
                    !this.swordAttacks.includes(this.currentPlayerAnimation) &&
                    !this.bowAttacks.includes(this.currentPlayerAnimation) &&
                    !this.meeleeAttacks.includes(this.currentPlayerAnimation) &&
                    !this.swordDraws.includes(this.currentPlayerAnimation) &&
                    !this.swordSheaths.includes(this.currentPlayerAnimation) &&
                    !this.magicAttacks.includes(this.currentPlayerAnimation) &&
                    this.currentPlayerAnimation!=='airSwing3Start' &&
                    this.currentPlayerAnimation!=='airSwing3Loop' &&
                    this.currentPlayerAnimation!=='airSwing3End'){
                this.prevEquippedWeapon = this.equippedWeapon;
                const currWeaponIdx = this.weaponsFound.findIndex((element) => {
                    return element===this.equippedWeapon;
                });
                if(pointer.deltaY > 0){
                    //console.log('scrolled mouse wheel down');
                    this.equippedWeapon = this.weaponsFound[(currWeaponIdx + 1) % this.weaponsFound.length];
                }
                else{
                    //console.log('scrolled mouse wheel up');
                    this.equippedWeapon = this.weaponsFound[(currWeaponIdx - 1) + (currWeaponIdx===0 ? this.weaponsFound.length : 0)];
                }
                console.log('previous weapon:', this.prevEquippedWeapon);
                console.log('current Weapon:', this.equippedWeapon);
                this.changedWeapon = true;
                this.swordDrawn = false;

                this.lastWeaponChangeTime = this.time.now;
            }
        }, this);

        this.input.keyboard.on('keyup-' + 'A', (event) => {
            this.controlConfig.leftControl.isDown = false;
            this.controlConfig.leftControl.isUp = true;
        });
        this.input.keyboard.on('keydown-' + 'A', (event) => {
            this.controlConfig.leftControl.isDown = true;
            this.controlConfig.leftControl.isUp = false;
        });
        this.input.keyboard.on('keyup-' + 'D', (event) => {
            this.controlConfig.rightControl.isDown = false;
            this.controlConfig.rightControl.isUp = true;
        });
        this.input.keyboard.on('keydown-' + 'D', (event) => {
            this.controlConfig.rightControl.isDown = true;
            this.controlConfig.rightControl.isUp = false;
        });
        this.input.keyboard.on('keyup-' + 'S', (event) => {
            this.controlConfig.downControl.isDown = false;
            this.controlConfig.downControl.isUp = true;
        });
        this.input.keyboard.on('keydown-' + 'S', (event) => {
            this.controlConfig.downControl.isDown = true;
            this.controlConfig.downControl.isUp = false;
        });

        handleCollisions(this);

        //ambient audio
        this.audio = new Audio(this);
        this.audio.ambience();


        //startRNN();
        // this.input.keyboard.on('keydown-' + 'P', (event) => {
        //     resumeRNN();
        // });
        // this.input.keyboard.on('keydown-' + 'O', (event) => {
        //     pauseRNN();
        // });

        //magentaTest();


        //this.add.image(200, 6400-64, 'environmentAtlas', 'chest_closed_green').setScale(this.chestScaleFactor).setOrigin(0,1);
    }

    update()
    {
        //console.log(this.player.body.velocity);
        // console.log('prev player animation:', this.prevPlayerAnimation);
        //console.log('current player animation:', this.currentPlayerAnimation);
        // console.log('player wall sliding?', this.playerWallSliding);
        // console.log(' ');
        //console.log(this.stopWallSlidingPosition);
        if(this.playerLedgeGrab){
            this.losingStamina = true;
        } 
 
        if(this.losingStamina || this.gainingStamina){
            this.updateStaminaPosition();
            this.removeStamina();
        }
        this.setSoundVolumes();
        handlePlayerMovement(this);
    }

    setSoundVolumes = () => {
        this.audio.floorAmbience.volume = Math.pow((this.player.y / this.maxGameHeight), 2);
        this.audio.windSound.volume = Math.pow(1 - (this.player.y / this.maxGameHeight), 2);
        if(this.audio.wallSlideSound.isPlaying){
            const factor = 0.05;
            this.audio.wallSlideSound.volume = this.player.body.velocity.y * factor + 0.3;
        }
        if(this.currentPlayerAnimation==='fall' && this.player.body.velocity.y > this.playerMaxSpeed * 0.7){
            if(!this.audio.windFlap.isPlaying){
                this.audio.windFlap.play(this.audio.windFlapConfig);
            }
        }
        // else{
        //     this.audio.windFlap.stop();
        // }
    }

    drawStamina = () => {
        //console.log('drawing stamina bar');
        this.staminaActive = true;
        const offset = 100;
        this.staminaOutline = this.add.image(this.player.x + offset, this.player.y, 'staminaOutline');
        this.staminaOutline.setDepth(10).setScale(1/3);
        this.staminaFill = this.add.image(this.staminaOutline.getBottomLeft().x + 1, this.staminaOutline.getBottomLeft().y - 1, 'staminaFill').setOrigin(0,1);
        this.staminaFill.setDepth(10).setScale(1/3, this.stamina/3);
        //console.log('stamina outline display height:', this.staminaOutline.displayHeight);
        //console.log('stamina fill display height:', this.staminaFill.displayHeight);
    }

    updateStaminaPosition = () => {
        const offset = 100;
        if(this.losingStamina){
            if(this.stamina <= 0){
                this.stamina = 0;
                this.resetWallSlide = true;
            }
            else{
                this.stamina += this.staminaLossRate;
            }       
        }
        else{
            if(this.stamina >= 100){
                this.stamina = 100;
            }
            else{
                this.stamina += this.staminaRegenRate;
            }
            
        }
        
        this.staminaOutline.setPosition(this.player.x + offset, this.player.y);
        this.staminaFill.setScale(1/3, this.stamina/3);
        this.staminaFill.setPosition(this.staminaOutline.getBottomLeft().x + 1, this.staminaOutline.getBottomLeft().y - 1).setOrigin(0,1);
    }

    removeStamina = () => {
        //console.log('checking if we should remove stamina bar');
        if(this.stamina===100){
            if(this.staminaOutline){
                this.staminaOutline.destroy();
            }
            if(this.staminaFill){
                this.staminaFill.destroy();
            }            
            this.gainingStamina = false;
            this.losingStamina = false;
            this.staminaActive = false;
        }
    }
}
