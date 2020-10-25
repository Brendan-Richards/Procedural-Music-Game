import Phaser, { Scene } from 'phaser';
import makeCharacterAnimations from './CharacterAnimations';
import ContentGenerator from './ContentGenerator';
import handleCollisions from './Collisions';
import handlePlayerMovement from './PlayerMovement';
import Audio from './Audio';
import { startRNN, pauseRNN, resumeRNN } from './performanceRNN';
import 'regenerator-runtime/runtime';

type controlConfig = {
    leftControl: Phaser.Input.Keyboard.Key,
    rightControl: Phaser.Input.Keyboard.Key,
    jumpControl: Phaser.Input.Keyboard.Key,
    groundSlide: {
        isDown: boolean,
        isUp: boolean
    }    
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
    playerRampSliding: boolean;
    playerFlatSliding: boolean;
    playerWallSliding: boolean;
    playerWallJumping: boolean;
    staminaActive: boolean;
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
    staminaOutline: Phaser.GameObjects.Image;
    staminaFill: Phaser.GameObjects.Image;
    playerJumpHeight: number;
    staminaLossRate: number;
    staminaRegenRate: number;
    playerLedgeClimb: boolean;
    stamina: number;
    playerLedgeGrab: boolean;
    playerWallJumpHeight: number;
    playerIceJumpHeight: number;
    playerFriction: number;
    numChests: number;
    chestScaleFactor: number;
    currentPlayerAnimation: string;
    prevPlayerAnimation: string;
    currentPlayerDirection: string;
    prevPlayerDirection: string;
    playerMaxSpeed: number;
    lastLandingTime: number;
    audio: Audio;
    bg2: Phaser.GameObjects.Image;

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
        this.playerMaxSpeed = 15;
        this.playerIceJumpHeight = -1.5*this.playerSpeed;
        this.ledgePosition = {};
        this.stamina = 100;
        //units of pixels per second of climbing
        this.staminaLossRate = -0.5;
        this.staminaRegenRate = 1.5;
        this.staminaOutline = null;
        this.staminaFill = null;

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
        this.cameras.main.setZoom(0.09);

        makeCharacterAnimations(this);

        const contentGenerator = new ContentGenerator(this, this.maxGameWidth, this.maxGameHeight, 'sparse');
        contentGenerator.createLevel();

        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');
        this.characterShapes = this.cache.json.get('characterShapes');
        const playerConfig = {
            
        }
        this.playerBody = this.matter.add.fromPhysicsEditor(100, this.maxGameHeight-100, this.characterShapes.adventurer_idle_00, playerConfig, false);    
        console.log('player body slop value:', this.playerBody.slop);
          
        this.player.setExistingBody(this.playerBody);
        this.player.setScale(this.playerScaleFactor);
        
        console.log('created character at:', this.playerBody.position);

        // this.cameras.main.setBackgroundColor('rgba(2, 63, 157, 1)');
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 1)');
        //this.cameras.main.setTint(30);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
      
        //input setup
        /////////////////////////////////////////////////////////////////////////////////
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controlConfig = {
            leftControl: this.cursors.left as Phaser.Input.Keyboard.Key,
            rightControl: this.cursors.right as Phaser.Input.Keyboard.Key,
            jumpControl: this.cursors.space as Phaser.Input.Keyboard.Key,
            groundSlide: {
                isDown: this.CTRLDown,
                isUp: !this.CTRLDown
            }
        }
        this.input.keyboard.on('keydown-' + 'CTRL', (event) => {
            this.CTRLDown = true;
        })
        this.input.keyboard.on('keyup-' + 'CTRL', (event) => {
            this.CTRLDown = false;
        })         

        handleCollisions(this);

        //ambient audio
        this.audio = new Audio(this);
        this.audio.ambience();


        //startRNN();

        this.input.keyboard.on('keydown-' + 'P', (event) => {
            resumeRNN();
        });
        this.input.keyboard.on('keydown-' + 'O', (event) => {
            pauseRNN();
        });


        this.player.on('animationcomplete', (animation, frame) => {
            //console.log('in animation complete callback');
            if(animation.key==='ledgeClimb'){
                this.playerLedgeClimb = false;
            } 
        }, this);

        this.add.image(200, 6400-64, 'environmentAtlas', 'chest_closed_green').setScale(this.chestScaleFactor).setOrigin(0,1);
    }

    update()
    {
        if(this.playerLedgeGrab){
            this.losingStamina = true;
        } 
 
        if(this.losingStamina || this.gainingStamina){
            this.updateStaminaPosition();
            this.removeStamina();
        }
        this.setAmbientVolumes();
        handlePlayerMovement(this);
    }

    setAmbientVolumes = () => {
        this.audio.floorAmbience.volume = Math.pow((this.player.y / this.maxGameHeight), 2);
        this.audio.windSound.volume = Math.pow(1 - (this.player.y / this.maxGameHeight), 2);
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
