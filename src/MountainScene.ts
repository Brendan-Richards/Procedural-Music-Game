import Phaser, { Scene } from 'phaser';
import {animationLogic, createAnimations} from './CharacterAnimations';
import ContentGenerator from './ContentGenerator';
import {handleCollisions, setCollisionMask} from './Collisions';
import { manageSocket } from './ManageSocket';
import { managePlayerInput } from './ManagePlayerInput';
import { endMatch } from './EndMatch';
import { loadAssets } from './LoadAssets';
import handlePlayerMovement from './PlayerMovement';
import HealthBar from './HealthBar';
import Audio from './Audio';
import MatchFindingScene from './MatchFindingScene';
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
    lastWallCollisionDirection: string | null;
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
    //losingStamina: boolean;
    //gainingStamina: boolean;
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
    //staminaOutline: Phaser.GameObjects.Image;
    //staminaFill: Phaser.GameObjects.Image;
    playerJumpHeight: number;
    //staminaLossRate: number;
    //staminaRegenRate: number;
    prevSwordSwing: string;
    playerLedgeClimb: boolean;
    playerAttacking: boolean;
    attackDown: boolean;
    //stamina: number;
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
    matchEnded: boolean;
    allowSound: boolean;
    playerHealth: number;
    opponentHealth: number;

    playerProjectilesCategory: number
    opponentProjectilesCategory: number;
    terrain: Phaser.GameObjects.GameObject;
    collisionCategories;

    back1: Phaser.GameObjects.Image;

	constructor()
	{
        super('MountainScene');

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
        };
        this.playerHealth = 100;
        this.opponentHealth = 100;
        this.lastWallCollisionDirection = null;
        this.allowSound = true;
        this.matchEnded = false;
        this.magicDamageAmount = 40;
        this.arrowDamageAmount = 25;
        this.swordDamageAmount = 50;
        this.opponent = null;
        this.swordRecoil = 30;
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
        this.treeScaleFactor = 0.4;
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
        //this.stamina = 100;
        //units of pixels per second of climbing
        //this.staminaLossRate = -0.1;
        //this.staminaRegenRate = 1.5;
        //this.staminaOutline = null;
        //this.staminaFill = null;
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
        this.weaponsFound = ['sword', 'bow'];
        this.arrowSpeed = 9;
        this.magicSpeed = 7;
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
        //console.log('tilemap cache keys before loading:', this.cache.tilemap.getKeys());
        this.cache.tilemap.remove('map');
        const map = this.make.tilemap({ key: "map" });
        
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
        loadAssets(this);
    }

    create()
    {
        console.log('in the create functiono mountain scene')

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

        manageSocket(this);
           
        //console.log('created character at:', this.playerBody.position);

        //this.cameras.main.setBackgroundColor('rgba(2, 63, 157, 1)');
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');
        //this.cameras.main.setTint(30);
        
        managePlayerInput(this);

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

        console.log('animation list:', this.anims.toJSON());
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
        //this.playerHealthBar = new HealthBar(this, this.player, 0x2635be);
        animationLogic(this);
        createAnimations(this, '000', 'playerOpponent0');
        createAnimations(this, '100', 'player100');
        createAnimations(this, '075', 'player75');
        createAnimations(this, '050', 'player50');
        createAnimations(this, '025', 'player25');
        handleCollisions(this);

        this.player.body.collisionFilter.category = this.collisionCategories.player;
        setCollisionMask(this, this.player, ['player','opponent', 'playerBox', 'playerArrow', 'playerMagic', 'playerExplosion']);

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
        //this.opponentHealthBar = new HealthBar(this, this.opponent, 0xa24700);
        this.opponent.body.collisionFilter.category = this.collisionCategories.opponent;
        setCollisionMask(this, this.opponent, ['opponent', 'player', 'opponentBox', 'opponentArrow', 'opponentMagic', 'opponentExplosion']);
        console.log('opponent:', this.opponent);
        createAnimations(this, 'Opponent000', 'playerOpponent0');
        createAnimations(this, 'Opponent100', 'opponent100');
        createAnimations(this, 'Opponent075', 'opponent75');
        createAnimations(this, 'Opponent050', 'opponent50');
        createAnimations(this, 'Opponent025', 'opponent25');
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

    update(){
        if(this.opponent && this.opponent.angle !== 0){
            this.opponent.angle = 0;
        }
        if(this.playerHealth <= 0 || this.matchEnded){
            //player died, end match
            if(!this.matchEnded){
                endMatch(this);
            }
        }
        else{
            //this.playerHealthBar.decrease(0.9);

            this.setSoundVolumes();
            handlePlayerMovement(this);
    
            this.socket.emit('playerMovementUpdate', {
                x: this.player.x, 
                y: this.player.y, 
                vx: this.player.body.velocity.x, 
                vy: this.player.body.velocity.y
            });
        }
        // this.playerHealthBar.setPosition();
        // this.opponentHealthBar.setPosition();
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
    }

}

