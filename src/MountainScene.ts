import Phaser, { Scene } from 'phaser';
import makeCharacterAnimations from './CharacterAnimations';
import ContentGenerator from './ContentGenerator';
import handleCollisions from './Collisions';
import handlePlayerMovement from './PlayerMovement';
import Audio from './Audio';
import { io } from 'socket.io-client';
//import { startRNN, pauseRNN, resumeRNN } from './performanceRNN';
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
    arrowScale: number;
    socket: io.Socket;
    opponent: Phaser.Physics.Matter.Sprite | null;
    trees: Array<Array<object>>;
    treeScaleFactor: number;
    loaded: boolean;

    back1: Phaser.GameObjects.Image;

	constructor()
	{
        super('mountainScene');

        this.opponent = null;
        this.trees = [];

        //this.timer = new Date();

        this.maxGameHeight = 800;
        this.maxGameWidth = 1280;
        // this.maxGameHeight = 6400;
        // this.maxGameWidth = 6400;
        this.chestScaleFactor = 0.6;
        this.treeScaleFactor = 0.4;
        this.numChests = 5;
        this.loaded = false;

        //set up player
        this.playerScaleFactor = 1;
        this.playerSpeed = 4.5
        this.playerJumpHeight = 8;
        this.playerWallJumpHeight = -2*this.playerSpeed;
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
        this.arrowSpeed = 17;
        this.magicSpeed = 11;
        this.mana = 100;
        this.madeMagic = false;
        this.magicType = 'red';
        this.arrowScale = 0.6;


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

    create()
    {
        this.matter.set60Hz();
        this.matter.world.engine.positionIterations=30;
        this.matter.world.engine.velocityIterations=30;
        console.log('velocity iterations:', this.matter.world.engine.velocityIterations);
        console.log('position iterations:', this.matter.world.engine.positionIterations);

        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight, 200, true, true, true, true);
        this.cameras.main.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight);
        this.cameras.main.setZoom(1.7);
        //this.cameras.main.setZoom(0.7);

        this.manageSocket();
           
        //console.log('created character at:', this.playerBody.position);

        //this.cameras.main.setBackgroundColor('rgba(2, 63, 157, 1)');
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');
        //this.cameras.main.setTint(30);
        
      
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
            const leftButton = 0;
            const rightButton = 2;
            if(this.equippedWeapon==='bow' && pointer.button===leftButton){
                this.bowRelease = true;               
            }
        }, this);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            //console.log(pointer);
            if(this.time.now - this.lastWeaponChangeTime > this.minTimeBetweenWeaponChanges &&
                    !this.swordAttacks.includes(this.currentPlayerAnimation) &&
                    !this.bowAttacks.includes(this.currentPlayerAnimation) &&
                    !this.meeleeAttacks.includes(this.currentPlayerAnimation) &&
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
                console.log('current player animation:', this.currentPlayerAnimation);
                this.changedWeapon = true;

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

    manageSocket = () => {
        this.socket = io();
        console.log('this.socket:', this.socket);

        this.socket.on("connect", () => {
            console.log('connected at this id:', this.socket.id);
        });

        this.socket.once('tileMap', (tileMapJson) => {
            console.log('client recieved tilemap:');
            console.log(tileMapJson);
            this.load.tilemapTiledJSON('map', tileMapJson);
            this.load.image("blackPixelTiles", "assets/images/tilesets/blackPixelTiles.png"); 
            this.load.start();
            this.load.on('complete', () => {
                console.log('finished loading tile files');
                const contentGenerator = new ContentGenerator(this);
                contentGenerator.createLevel();
        
                this.characterShapes = this.cache.json.get('characterShapes');  
                this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');  
                this.playerBody = this.matter.add.fromPhysicsEditor(100, this.maxGameHeight-100, this.characterShapes.adventurer_idle_00, undefined, false);    
                this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
                this.player.setExistingBody(this.playerBody);
                this.player.setScale(this.playerScaleFactor);
                makeCharacterAnimations(this);
                handleCollisions(this);
        
                //ambient audio
                this.audio = new Audio(this);
                this.audio.ambience();
                this.audio.floorAmbience.volume = 0.3;
                this.audio.windSound.volume = 0.05;
        
                this.loaded = true;   
            }, this);
        });

        this.socket.on('opponentMovementUpdate', (opponentData) => {
            console.log('client recieved opponentMovement Update');
            if(!this.opponent){
                this.opponent = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');
                const opponentBody = this.matter.add.fromPhysicsEditor(100, this.maxGameHeight-100, this.characterShapes.adventurer_idle_00, undefined, false);     
                this.opponent.setExistingBody(opponentBody);
                this.opponent.setScale(this.playerScaleFactor);
            }
            this.opponent.setPosition(opponentData.x, opponentData.y);
            this.opponent.setVelocity(opponentData.vx, opponentData.vy);
        });

        this.socket.on('createArrow', (arrowData) => {
            console.log('client recieved createArrow event');
           
            const arrow = this.matter.add.sprite(arrowData.x, arrowData.y, 'arrow', undefined);
            arrow.setScale(this.arrowScale);
            
            if(arrowData.flipX){
                arrow.setFlipX(true);
            }
            arrow.setCollisionGroup(-1);
            arrow.setIgnoreGravity(true);
            arrow.setFixedRotation();
            this.matter.setVelocity(arrow, arrowData.factor * this.arrowSpeed, 0);            
        });

        this.socket.on('createMagic', (magicData) => {
            console.log('client recieved createMagic event');

            //make magic
            const magic = this.matter.add.sprite(magicData.x, magicData.y, 'magicAtlas', magicData.frameName);
            magic.setScale(this.playerScaleFactor, this.playerScaleFactor);

            if(magicData.flipX){
                magic.setFlipX(true); 
            }
            
            if(magicData.magicType==='red'){
                magic.play('redMagic', true);
            }
            else{
                magic.play('blueMagic', true);
            }
            
            magic.setCollisionGroup(-1);
            magic.setIgnoreGravity(true);
            magic.setFixedRotation();
            this.matter.setVelocity(magic, magicData.factor * this.magicSpeed, 0);
        
        });

        this.socket.on('opponentAnimationUpdate', (opponentData) => {
            if(this.opponent){
                console.log('setting opponent animation to:', opponentData.currentAnimation);
                this.opponent.setScale(1);

                let bodyData = null;
                if(opponentData.currentAnimation.includes('Cast')){
                    switch(opponentData.currentAnimation){
                        case 'idleCastBlue':
                        case 'idleCastRed': {bodyData = this.characterShapes.adventurer_idleCast_00; break;}
                        case 'runCastRed':
                        case 'runCastBlue': {bodyData = this.characterShapes.adventurer_runCast_00; break;}
                        case 'jumpCastRed':
                        case 'jumpCastBlue': {bodyData = this.characterShapes.adventurer_jumpCast_00; break;}
                        case 'fallCastRed':
                        case 'fallCastBlue': {bodyData = this.characterShapes.adventurer_fallCast_00; break;}
                        case 'wallSlideCastRed':
                        case 'wallSlideCastBlue': {bodyData = this.characterShapes.adventurer_wallSlideCast_00; break;}   
                    }
                }
                else{
                    bodyData = this.characterShapes['adventurer_' + opponentData.currentAnimation + '_00'];
                }
                
                const opponentBody = this.matter.add.fromPhysicsEditor(this.opponent.x, this.opponent.y, bodyData, undefined, false);
                opponentBody.friction = opponentData.playerFriction;
            
                this.opponent.setExistingBody(opponentBody);
            
                this.opponent.setScale((opponentData.flipX ? -1 : 1)*this.playerScaleFactor, this.playerScaleFactor);
            
                this.opponent.play(opponentData.currentAnimation, false, 0);  
                
                this.opponent.setBounce(0);
                this.opponent.setFixedRotation(); 
                this.opponent.setCollisionGroup(-1);
            }
        });
    }

    update(){
        if(this.loaded){
            if(this.playerLedgeGrab){
                this.losingStamina = true;
            } 
     
            if(this.losingStamina || this.gainingStamina){
                this.updateStaminaPosition();
                this.removeStamina();
            }
            this.setSoundVolumes();
            handlePlayerMovement(this);
    
            this.socket.emit('playerMovementUpdate', {
                x: this.player.x, 
                y: this.player.y, 
                vx: this.player.body.velocity.x, 
                vy: this.player.body.velocity.y
            });
        }
    }

    setSoundVolumes = () => {
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

