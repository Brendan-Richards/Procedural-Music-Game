import Phaser, { Scene } from 'phaser';
import {animationLogic, createAnimations} from './CharacterAnimations';
import ContentGenerator from './ContentGenerator';
import {handleCollisions, makeExplosion, setCollisionMask} from './Collisions';
import handlePlayerMovement from './PlayerMovement';
import HealthBar from './HealthBar';
import Audio from './Audio';
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
    opponentAudio: Audio;
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
    playerHealthBar: HealthBar;
    opponentHealthBar: HealthBar;
    initialPlayerPosition: position;
    initialOpponentPosition: position;
    currentOpponentDirection: string;
    currentOpponentAnimation: string;
    lastSwordDamageTime: number;
    pingSendTime: number;
    latency: number;
    playerAttackBox: MatterJS.BodyType;
    opponentAttackBox: MatterJS.BodyType;
    wallTolerance: number;
    bowKick: boolean;
    playerMask: number;
    opponentMask: number;
    playerGroup: number;
    opponentGroup: number;
    noFrictionWindow: number;
    collisionPoints: Array<position>;
    lastWallCollision: number;
    lastGroundCollision: number;
    inContactWithGround: boolean;
    playerArrows: Array<Phaser.Physics.Matter.Sprite>;
    maxArrows: number;
    opponentArrows: Array<Phaser.Physics.Matter.Sprite>;
    bothAttacking: boolean;
    swordRecoil: number;
    recoilDuration: number;
    magicDamageAmount: number;
    arrowDamageAmount: number;
    swordDamageAmount: number;

    playerProjectilesCategory: number
    opponentProjectilesCategory: number;
    terrain: Phaser.GameObjects.GameObject;
    collisionCategories;

    back1: Phaser.GameObjects.Image;

	constructor()
	{
        super('mountainScene');

        //collision
        this.collisionCategories = {
            terrain: Math.pow(2, 0),
            player: Math.pow(2, 1),
            opponent: Math.pow(2, 2),
            playerBox: Math.pow(2, 3),
            opponentBox: Math.pow(2, 4),
            playerArrow: Math.pow(2, 5),
            opponentArrow: Math.pow(2, 6),
            playerMagic: Math.pow(2, 7),
            opponentMagic: Math.pow(2, 8),
            playerExplosion: Math.pow(2, 9),
            opponentExplosion: Math.pow(2, 10)
        }
        // this.playerGroup = -1;
        // this.opponentGroup = -2;
        // this.playerMask = 0x0001;
        // this.opponentMask = 0x0010;
        // this.playerProjectilesCategory = 2;
        // this.opponentProjectilesCategory = 4;

        this.magicDamageAmount = 50;
        this.arrowDamageAmount = 20;
        this.swordDamageAmount = 35;
        this.opponent = null;
        this.swordRecoil = 20;
        this.recoilDuration = 50;
        this.bothAttacking = false;
        this.maxArrows = 10;
        this.playerArrows = [];
        this.opponentArrows = [];
        this.inContactWithGround = true;
        this.lastGroundCollision = -1;
        this.lastWallCollision = -1;
        this.noFrictionWindow = 250;
        this.playerAttackBox = null;
        this.opponentAttackBox = null;
        this.currentOpponentAnimation = 'idle';
        this.currentOpponentDirection = 'right';
        this.lastSwordDamageTime = -1;
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
        this.wallTolerance = 30;
        this.playerScaleFactor = 1;
        this.playerSpeed = 3.5
        this.playerJumpHeight = 10;
        this.playerWallJumpHeight = -2*this.playerSpeed;
        this.playerFriction = 0;
        this.playerMaxSpeed = 7;
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
        this.equippedWeapon = 'sword';
        this.prevEquippedWeapon = '';
        // this.weaponsFound = ['none', 'sword', 'bow', 'glove'];
        this.weaponsFound = ['sword', 'bow', 'glove'];
        this.arrowSpeed = 12;
        this.magicSpeed = 10;
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
        this.bowKick = false;
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

    init(data){
        console.log('in the init function');
        this.load.tilemapTiledJSON('map', data.tileMap);
        this.collisionPoints = data.tileMap.collisionPoints;
        this.load.image("blackPixelTiles", "assets/images/tilesets/blackPixelTiles.png");   
        this.load.start();
        console.log('in init function, got tile data:', data.tileMap);
        this.socket = data.socket;
        this.initialPlayerPosition = data.playerPosition;
        this.initialOpponentPosition = data.opponentPosition;
    }
    
    preload(){
        console.log('in the preload function');
        //background layer
       this.load.image('grayBackground', './assets/images/background/grayBackground.png');

        //all character sprites
        this.load.atlas('characterAtlas', 'assets/images/characters/characterAtlasBlue.png', 'assets/json/characterAtlas.json');
        this.load.atlas('opponentAtlas', 'assets/images/characters/characterAtlasOrange.png', 'assets/json/characterAtlas.json');
        this.load.json('characterAtlasData', 'assets/json/characterAtlas.json');
        //bounding vertex information for the character
        this.load.json('characterShapes', 'assets/json/characterVerticies.json');

        //environment sprites
        this.load.atlas('environmentAtlas', 'assets/images/environment/environmentAtlas.png', 'assets/json/environmentAtlas.json');
        this.load.json('environmentAtlasData', 'assets/json/environmentAtlas.json'); 
        this.load.image("arrow", "assets/images/environment/arrowBlue.png");    
        
        //magic
        this.load.atlas('magicAtlas', 'assets/images/environment/magicBlueOrange.png', 'assets/json/magic.json');
        this.load.json('magicAtlasData', 'assets/json/magic.json');
        //blood effects
        this.load.atlas('bloodAtlas', 'assets/images/environment/blood.png', 'assets/json/blood.json');
        this.load.json('bloodAtlasData', 'assets/json/blood.json');    
        //explosion
        this.load.atlas('blueExplosionAtlas', 'assets/images/environment/blueExplosion.png', 'assets/json/explosion.json');
        this.load.atlas('orangeExplosionAtlas', 'assets/images/environment/orangeExplosion.png', 'assets/json/explosion.json');
        this.load.json('blueExplosionAtlasData', 'assets/json/explosion.json');   

        //audio
        this.load.audio('floorAmbience', 'assets/audio/floorAmbience.mp3');
        this.load.audio('steps', 'assets/audio/2step.mp3');
        this.load.audio('jump', 'assets/audio/swoosh.mp3');
        this.load.audio('wallSlide', 'assets/audio/wallSlide2.mp3');
        this.load.audio('wallSmack', 'assets/audio/wallSmack.mp3');
        this.load.audio('wallJump', 'assets/audio/wallSmack.mp3');
        this.load.audio('wind', 'assets/audio/windLoop.mp3');
        this.load.audio('hardLanding', 'assets/audio/landing.mp3');
        this.load.audio('windFlap', 'assets/audio/windFlap.mp3');
        this.load.audio('attack', 'assets/audio/attack.mp3');
        this.load.audio('draw', 'assets/audio/swordDraw.mp3');
        this.load.audio('sheath', 'assets/audio/swordSheath.mp3');
        this.load.audio('swordRockImpact', 'assets/audio/swordRockImpact.mp3');
        this.load.audio('fistWallImpact', 'assets/audio/fistWallImpact.mp3');
        this.load.audio('punch', 'assets/audio/punch.mp3');
        this.load.audio('kick', 'assets/audio/kick.mp3');
        this.load.audio('arrowWallImpact1', 'assets/audio/arrowWallImpact1.mp3');
        this.load.audio('arrowWallImpact2', 'assets/audio/arrowWallImpact2.mp3');
        this.load.audio('arrowWallImpact3', 'assets/audio/arrowWallImpact3.mp3');
        this.load.audio('bowDraw', 'assets/audio/bowDraw.mp3');
        this.load.audio('bowRelease', 'assets/audio/bowRelease.mp3');
        this.load.audio('cast', 'assets/audio/fullCast.mp3');
        this.load.audio('arrowBodyImpact', 'assets/audio/arrowBodyImpact.mp3');
        this.load.audio('swordSwordImpact', 'assets/audio/swordSwordImpact1.mp3');
        this.load.audio('swordBodyImpact', 'assets/audio/swordBodyImpact.mp3');

        //UI
        this.load.image("staminaOutline", "assets/images/UI/staminaOutline.png");
        this.load.image("staminaFill", "assets/images/UI/staminaFill.png");      
    }

    create()
    {
        console.log('in the create function')
        this.matter.set60Hz();
        this.matter.world.engine.positionIterations=30;
        this.matter.world.engine.velocityIterations=30;
        console.log('velocity iterations:', this.matter.world.engine.velocityIterations);
        console.log('position iterations:', this.matter.world.engine.positionIterations);

        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight, 200, true, true, true, true);
        this.cameras.main.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight);
        this.cameras.main.setZoom(1.7);
        //this.cameras.main.setZoom(0.5);

        this.matter.world.walls.left.label = 'worldBoundary';
        this.matter.world.walls.right.label = 'worldBoundary';
        this.matter.world.walls.top.label = 'worldBoundary';
        this.matter.world.walls.bottom.label = 'worldBoundary';
        //console.log('matter walls', this.matter.world.walls);

        const contentGenerator = new ContentGenerator(this);
        contentGenerator.createLevel();

        this.createTerrainBody();

        this.createPlayer();

        this.createOpponent();

        //set up audio
        this.audio = new Audio(this);
        this.audio.startAnimationAudio(this);
        this.audio.ambience();
        this.audio.floorAmbience.sound.volume = 0.3;
        this.audio.windSound.sound.volume = 0.05;
        this.opponentAudio = new Audio(this);

        this.manageSocket();
           
        //console.log('created character at:', this.playerBody.position);

        //this.cameras.main.setBackgroundColor('rgba(2, 63, 157, 1)');
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');
        //this.cameras.main.setTint(30);
        
        this.manageInput();

        // console.log('checking log of sword swing sound:');
        // console.log(this.audio['swordSwingSound']);

        //startRNN();
        // this.input.keyboard.on('keydown-' + 'P', (event) => {
        //     resumeRNN();
        // });
        // this.input.keyboard.on('keydown-' + 'O', (event) => {
        //     pauseRNN();
        // });

        //magentaTest();

    }

    createPlayer = () => {
        //make player character
        this.characterShapes = this.cache.json.get('characterShapes');  
        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idleSwordDrawn_00.png');  
        this.playerBody = this.matter.add.fromPhysicsEditor(this.initialPlayerPosition.x, this.initialPlayerPosition.y, this.characterShapes.adventurer_idleSwordDrawn_00, {
            render: { sprite: { xOffset: 0, yOffset: 0.1 } },
            label: 'player',
            collisionFilter: {
                group: 0
            }
        }, false);    
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.player.setExistingBody(this.playerBody);
        console.log('player right aftyer setting body:', this.player);
        this.player.setScale(this.playerScaleFactor);
        this.playerHealthBar = new HealthBar(this, this.player, 0x2635be);
        animationLogic(this);
        createAnimations(this);
        handleCollisions(this);

        this.player.body.collisionFilter.category = this.collisionCategories.player;
        setCollisionMask(this, this.player, ['player', 'playerBox', 'playerArrow', 'playerMagic', 'playerExplosion']);

        console.log('player:', this.player);
    }

    createOpponent = () => {
        //make opponent
        this.opponent = this.matter.add.sprite(0, 0, 'opponentAtlas', 'adventurer_idleSwordDrawn_00.png');
        const opponentBody = this.matter.add.fromPhysicsEditor(this.initialOpponentPosition.x, this.initialOpponentPosition.y, this.characterShapes.adventurer_idleSwordDrawn_00, {
            render: { sprite: { xOffset: 0, yOffset: 0.1 } },
            label: 'opponent'
        }, false);     
        this.opponent.setExistingBody(opponentBody);
        this.opponent.setScale(this.playerScaleFactor);
        this.opponentHealthBar = new HealthBar(this, this.opponent, 0xa24700);
        this.opponent.body.collisionFilter.category = this.collisionCategories.opponent;
        setCollisionMask(this, this.opponent, ['opponent', 'opponentBox', 'opponentArrow', 'opponentMagic', 'opponentExplosion']);
        console.log('opponent:', this.opponent);
        createAnimations(this, 'Opponent', 'opponentAtlas');
    }

    createTerrainBody = () => {
        const poly = this.add.polygon(0, 0, this.collisionPoints, 0x0000ff, 0);
        poly.name = 'terrain';

        this.terrain = this.matter.add.gameObject(poly, {
            shape: { 
                type: 'fromVerts', 
                verts: this.collisionPoints, 
                flagInternal: true   
            }
        });
        poly.setPosition(this.maxGameWidth * this.terrain.body.centerOfMass.x, this.maxGameHeight - (poly.displayHeight * (1 - this.terrain.body.centerOfMass.y)));
        this.terrain.body.isStatic = true;
        console.log('terrain body:', this.terrain);
        this.terrain.body.collisionFilter.category = this.collisionCategories.terrain;
        this.terrain.body.label = 'terrain';
    }

    manageInput = () => {
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
            else if(this.equippedWeapon==='bow' && canAttack && !this.playerWallSliding){
                if(pointer.leftButtonDown()){ 
                    this.playerAttacking = true; 
                    this.bowRelease = false;
                }
                else if(pointer.rightButtonDown() && this.playerCanJump){
                    this.playerAttacking = true;
                    this.bowKick = true;
                }                
            }
            if(this.equippedWeapon==='glove' && !this.playerAttacking && !this.audio.castSound.sound.isPlaying){
                const leftButton = 0;
                const rightButton = 2;
                //console.log(pointer)
                if(pointer.button===leftButton){                   
                    this.magicType = 'blue';
                    this.playerAttacking = true;
                }
                // else if(pointer.button===rightButton){ 
                //     this.magicType = 'blue';
                //     this.playerAttacking = true;
                // }  
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
                //console.log('previous weapon:', this.prevEquippedWeapon);
                //console.log('current Weapon:', this.equippedWeapon);
                //console.log('current player animation:', this.currentPlayerAnimation);
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
    }

    manageSocket = () => {

        this.socket.on('opponentMovementUpdate', (opponentData) => {
            //console.log('client recieved opponentMovement Update');
            this.opponent.setPosition(opponentData.x, opponentData.y);
            this.opponent.setVelocity(opponentData.vx, opponentData.vy);
        });

        this.socket.on('createArrow', (arrowData) => {
            //console.log('client recieved createArrow event');
           
            const arrow = this.matter.add.sprite(arrowData.x, arrowData.y, 'arrow', undefined);
            arrow.setScale(this.arrowScale);
            
            this.opponentArrows.push(arrow);

            if(this.opponentArrows.length > this.maxArrows){
                const oldest = this.opponentArrows.shift();
                oldest.destroy();
            }
            
            if(arrowData.flipX){
                arrow.setFlipX(true);
            }

            arrow.body.label = 'opponentArrow';
            arrow.body.collisionFilter.category = this.collisionCategories.opponentArrow;
            setCollisionMask(this, arrow, ['opponent', 'playerBox', 'playerArrow', 'opponentArrow', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);    
        
            // arrow.setCollisionGroup(this.opponentGroup);
            // arrow.setCollisionCategory(this.opponentProjectilesCategory);
            // arrow.body.collisionFilter.mask = 0x1000;
            // arrow.setCollisionCategory(this.opponentMask);
            // arrow.setCollidesWith(this.playerMask);
            arrow.setIgnoreGravity(true);
            arrow.setFixedRotation();
            this.matter.setVelocity(arrow, arrowData.factor * this.arrowSpeed, 0);            
        });

        this.socket.on('createMagic', (magicData) => {
            //console.log('client recieved createMagic event');

            //make magic
            const magic = this.matter.add.sprite(magicData.x, magicData.y, 'magicAtlas', magicData.frameName);
            magic.setScale(this.playerScaleFactor, this.playerScaleFactor);
            magic.name = 'opponentMagic';

            if(magicData.flipX){
                magic.setFlipX(true); 
            }
            
            magic.play('redMagic', true);
            // if(magicData.magicType==='red'){
                
            // }
            // else{
            //     magic.play('blueMagic', true);
            // }

            magic.body.label = 'opponentMagic';
            magic.body.collisionFilter.category = this.collisionCategories.opponentMagic;
            setCollisionMask(this, magic, ['opponent', 'playerBox', 'playerArrow', 'opponentArrow', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);    
        
            // magic.setCollisionGroup(this.opponentGroup);
            // magic.setCollisionCategory(this.opponentMask);
            // magic.setCollidesWith(this.playerMask);
            magic.setIgnoreGravity(true);
            magic.setFixedRotation();
            this.matter.setVelocity(magic, magicData.factor * this.magicSpeed, 0);
        
        });

        this.socket.on('opponentDamaged', damageAmount => {
            this.opponentHealthBar.decrease(damageAmount);
        });

        this.socket.on('opponentSound', soundData => {
            console.log('recieved sound start event');
            console.log(soundData);
            const distance = {x: Math.abs(this.player.x - soundData.x), y: Math.abs(this.player.y - soundData.y)};
            console.log('distance of sound to player:', distance);
            this.opponentAudio[soundData.name].sound.play(this.opponentAudio[soundData.name].config);
            console.log('sound object is:', this.opponentAudio[soundData.name]);
            const newVolume = this.soundAttenuation(this.opponentAudio[soundData.name].config.volume, distance);
            console.log('new volume:', newVolume);
            this.opponentAudio[soundData.name].sound.volume = newVolume;
        });

        this.socket.on('opponentSoundStop', soundData => {
            console.log('recieved sound stop event');
            soundData.forEach(element => {
                if(this.opponentAudio[element].sound.isPlaying){
                    this.opponentAudio[element].sound.stop();
                }
            });
        });

        this.socket.on('opponentRecoil', () => {
            const oFactor = this.currentOpponentDirection==='left' ? 1 : -1;
            this.tweens.add({
                targets: this.opponent,
                duration: this.recoilDuration,
                x: this.opponent.body.position.x+(oFactor * this.swordRecoil)
            });
        });

        this.socket.on('bloodAnimation', data => {
            const blood = this.add.sprite(data.x, data.y, 'bloodAtlas', '1_0.png');
            blood.play('blood');
            blood.once('animationcomplete', animation => {
                console.log('finished blood animation');
                blood.destroy();
            });
        });

        this.socket.on('explosion', data => {
            makeExplosion(this, data.x, data.y, data.opponent);
        });

        this.socket.on('removeAttackBoxes', () => {
            console.log('removing attack boxes');
            this.bothAttacking = false;
            if(this.playerAttackBox){
                this.matter.world.remove(this.playerAttackBox);
                this.playerAttackBox = null;
            }
            if(this.opponentAttackBox){
                this.matter.world.remove(this.opponentAttackBox);
                this.opponentAttackBox = null;
            }
            
            
        });

        this.socket.on('opponentAnimationUpdate', (opponentData) => {
            if(this.opponent){
                //console.log('setting opponent animation to:', opponentData.currentAnimation + 'Opponent');
                this.opponent.setScale(1);
            
                this.opponent.setScale((opponentData.flipX ? -1 : 1)*this.playerScaleFactor, this.playerScaleFactor);
            
                this.opponent.play(opponentData.currentAnimation + 'Opponent', false, 0);  
    
                this.opponent.setBounce(0);
                this.opponent.setFixedRotation(); 

                this.currentOpponentDirection = opponentData.flipX ? 'left' : 'right';
                this.currentOpponentAnimation = opponentData.currentAnimation + 'Opponent';

                if(this.opponentAttackBox){
                    this.matter.world.remove(this.opponentAttackBox);
                    this.opponentAttackBox = null;
                }
                if(this.swordAttacks.includes(opponentData.currentAnimation) || opponentData.currentAnimation==='bowKick'){
                    let xOffset = 0;
                    let yOffset = 0;
                    let radius = 10
                    const factor = opponentData.flipX ? -1 : 1;
                    switch(opponentData.currentAnimation){
                        case 'bowKick': {xOffset = 8; yOffset = 1; radius = 9; break;}
                        case 'airSwing1': {xOffset = 12; yOffset = -6; radius = 9; break;}
                        case 'airSwing2': {xOffset = 12; yOffset = -7; radius = 12; break;}
                        case 'runSwing': {xOffset = 14; yOffset = 0; radius = 9; break;}
                        case 'idleSwing1': {xOffset = 10; yOffset = -2; break;}
                        case 'idleSwing2': {xOffset = 12; yOffset = -7; break;}
                    }

                    this.opponentAttackBox = this.matter.add.circle(this.opponent.x + (factor * xOffset), this.opponent.y + yOffset, radius, {
                        label: 'opponentBox',
                        ignoreGravity: true,
                        collisionFilter: {
                            group: this.opponentGroup
                        }
                    });

                    const gameObj = this.add.circle(this.opponent.x + (factor * xOffset), this.opponent.y + yOffset, radius, undefined, 0);
                    gameObj.body = this.opponentAttackBox;
                    this.opponentAttackBox.collisionFilter.category = this.collisionCategories.opponentBox;
                    //console.log('dummy opponent game obj:', gameObj);
                    setCollisionMask(this, gameObj, ['terrain', 'opponent', 'opponentBox', 'opponentArrow', 'playerMagic', 'opponentMagic', 'playerExplosion', 'opponentExplosion']);
                    //console.log('dummy game obj after setting collision:', gameObj);
                }


            }
        });

        console.log('setting ping..');
        this.socket.on('ping', () => {
            this.latency = this.time.now - this.pingSendTime;
            console.log('latency is:', this.latency, 'ms'); 
        });
        
    }

    soundAttenuation = (v0: number, distance: {x: number, y: number}): number => {
        const norm = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
        return v0 * Math.exp(-1 * 2.5 * norm/this.maxGameWidth);
    }

    update(){
        //if(this.loaded){
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

            this.playerHealthBar.setPosition();
            this.opponentHealthBar.setPosition();

            //console.log(this.player.body.velocity);
       // }
    }

    setSoundVolumes = () => {
        if(this.audio.wallSlideSound.sound.isPlaying){
            const factor = 0.05;
            this.audio.wallSlideSound.sound.volume = this.player.body.velocity.y * factor + 0.3;
        }
        if(this.currentPlayerAnimation==='fall' && this.player.body.velocity.y > this.playerMaxSpeed * 0.7){
            if(!this.audio.windFlap.sound.isPlaying){
                this.audio.windFlap.sound.play(this.audio.windFlap.config);
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

