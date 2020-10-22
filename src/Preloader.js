import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('preloader');
    }

    preload()
    {
        //background layers
        this.load.image('backgroundLayer0', './assets/images/background/originals/backgroundLayer0_ex.png');
        //this.load.image('backgroundLayer0b', './assets/images/background/originals/backgroundLayer0b.png');
        this.load.image('backgroundLayer1', './assets/images/background/originals/backgroundLayer1_ex.png');
        //this.load.image('backgroundLayer1b', './assets/images/background/originals/backgroundLayer1b.png');
        this.load.image('backgroundLayer2', './assets/images/background/originals/backgroundLayer2_ex.png');
        //this.load.image('backgroundLayer2b', './assets/images/background/originals/backgroundLayer2b.png');
        this.load.image('backgroundLayer3', './assets/images/background/originals/backgroundLayer3_ex.png');
       // this.load.image('backgroundLayer3b', './assets/images/background/originals/backgroundLayer3b.png');

        // this.load.image('backgroundLayer0', './assets/images/background/rescaledCompressed/backgroundLayer0.png');
        // this.load.image('backgroundLayer0b', './assets/images/background/rescaledCompressed/backgroundLayer0b.png');
        // this.load.image('backgroundLayer1', './assets/images/background/rescaledCompressed/backgroundLayer1.png');
        // this.load.image('backgroundLayer1b', './assets/images/background/rescaledCompressed/backgroundLayer1b.png');
        // this.load.image('backgroundLayer2', './assets/images/background/rescaledCompressed/backgroundLayer2.png');
        // this.load.image('backgroundLayer2b', './assets/images/background/rescaledCompressed/backgroundLayer2b.png');
        // this.load.image('backgroundLayer3', './assets/images/background/rescaledCompressed/backgroundLayer3.png');
        // this.load.image('backgroundLayer3b', './assets/images/background/rescaledCompressed/backgroundLayer3b.png');

        //background prebuilt
        //this.load.image('background', './assets/images/background/originals/background.png');
       // this.load.image('background2', './assets/images/background/originals/background2.png');

        //all character sprites
        this.load.atlas('characterAtlas', 'assets/images/characters/characterAtlas.png', 'assets/json/characterAtlas.json');
        this.load.json('characterAtlasData', 'assets/json/characterAtlas.json');
        //bounding vertex information for the character
        this.load.json('characterShapes', 'assets/json/characterVerticies.json');

        //environment sprites
        this.load.atlas('environmentAtlas', 'assets/images/environment/environmentAtlas.png', 'assets/json/environmentAtlas.json');
        this.load.json('environmentAtlasData', 'assets/json/environmentAtlas.json');        

        //tilemap
        //this.load.image("tiles", "assets/images/tilesets/snowyRocks.png");
       // this.load.tilemapTiledJSON('map', 'assets/json/newnewnew.json');
        this.load.tilemapTiledJSON('map', 'assets/json/snowWithIce.json');
        this.load.image("iceTiles", "assets/images/tilesets/icyRocks.png");
       // this.load.tilemapTiledJSON('iceMap', 'assets/json/newnewnew.json');

        //audio
        this.load.audio('floorAmbience', 'assets/audio/floorAmbience.mp3');
        this.load.audio('steps', 'assets/audio/2step.mp3');
        this.load.audio('jump', 'assets/audio/jump.mp3');
        this.load.audio('wallSlide', 'assets/audio/wallSlide.mp3');
        this.load.audio('wind', 'assets/audio/windLoop.mp3');
        this.load.audio('hardLanding', 'assets/audio/thud.mp3');

        //UI
        this.load.image("staminaOutline", "assets/images/UI/staminaOutline.png");
        this.load.image("staminaFill", "assets/images/UI/staminaFill.png");
        
    }

    create()
    {
        this.scene.start('mountainScene');
    }
}