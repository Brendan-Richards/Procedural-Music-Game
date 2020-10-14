import Phaser, { Scene } from 'phaser';
import makeCharacterAnimations from './CharacterAnimations';
import ContentGenerator from './ContentGenerator';
import handleCollisions from './Collisions';
import handlePlayerMovement from './PlayerMovement';
import Audio from './Audio';

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
    playerRampSliding: boolean;
    playerFlatSliding: boolean;
    playerWallSliding: boolean;
    playerWallJumping: boolean;
    flatSlideStartTime: number;
    playerLastOnGroundTime: number;
    playerGroundSlideDirection: string;
    wallJumpOffPosition: position;
    prevJumpTime: number;
    stopWallSlidingPosition: position;
    stopWallSlidingDirection: string;
    playerScaleFactor: number;
    playerSpeed: number;
    playerJumpHeight: number;
    playerFriction: number;
    currentPlayerAnimation: string;
    prevPlayerAnimation: string;
    currentPlayerDirection: string;
    prevPlayerDirection: string;
    playerMaxSpeed: number;
    audio: Audio;
    bg2: Phaser.GameObjects.Image;

    back1: Phaser.GameObjects.Image;

	constructor()
	{
        super('mountainScene');

        this.timer = new Date();

        this.maxGameHeight = 10000;
        this.maxGameWidth = 6400;

        //set up player
        this.playerScaleFactor = 1.7;
        this.playerSpeed = 6;
        this.playerJumpHeight = 12;
        this.playerFriction = 0;
        this.playerMaxSpeed = 17;

        //flags
        this.playerCanJump = true;
        this.CTRLDown = false;
        this.setFlatSlide = false;
        this.playerRampSliding = false;
        this.playerFlatSliding = false;
        this.playerWallSliding = false;
        this.playerWallJumping = false;

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
        


	}

    create()
    {
        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight, 64, true, true, false, true);
        this.cameras.main.setBounds(0, 0, this.maxGameWidth, this.maxGameHeight);
        //this.cameras.main.setZoom(0.09);

        makeCharacterAnimations(this);

        // const bg1 = this.add.image(0, this.cameras.main.height, 'backgroundLayer0')
        //                 .setScrollFactor(0, 0)
        //                 .setOrigin(0,1);
        // const scrollAmount = this.maxGameHeight - this.cameras.main.height;
        // console.log('scroll amount:', scrollAmount);
        // const scrollFactorY = .0345;
        // this.bg2 = this.add.image(0, scrollFactorY * scrollAmount + this.cameras.main.height, 'backgroundLayer1')
        //                 .setScrollFactor(0.5, scrollFactorY)
        //                 .setOrigin(0, 1);


        const contentGenerator = new ContentGenerator(this, this.maxGameWidth, this.maxGameHeight, 'sparse');
        contentGenerator.createLevel();


        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');
        this.characterShapes = this.cache.json.get('characterShapes');
        this.playerBody = this.matter.add.fromPhysicsEditor(100, this.maxGameHeight-100, this.characterShapes.adventurer_idle_00, undefined, false);

        this.player.setExistingBody(this.playerBody);
        this.player.setScale(this.playerScaleFactor);
        console.log('created character at:', this.playerBody.position);

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
    }

    update()
    {
        handlePlayerMovement(this);
    }
}
