import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('preloader');
    }

    preload()
    {
        //this.load.image('mountainBackground', './assets/images/background/abc.png');
        this.load.image('rockWall1', './assets/images/environment/rockWall1.png');
        this.load.image('grass', './assets/images/environment/grass.png');
        this.load.image('verticalStrip', './assets/images/environment/verticalStrip.png');

        //background layers
        this.load.image('backgroundLayer0', './assets/images/background/originals/backgroundLayer0.png');
        this.load.image('backgroundLayer0b', './assets/images/background/originals/backgroundLayer0b.png');
        this.load.image('backgroundLayer1', './assets/images/background/originals/backgroundLayer1.png');
        this.load.image('backgroundLayer1b', './assets/images/background/originals/backgroundLayer1b.png');
        this.load.image('backgroundLayer2', './assets/images/background/originals/backgroundLayer2.png');
        this.load.image('backgroundLayer2b', './assets/images/background/originals/backgroundLayer2b.png');
        this.load.image('backgroundLayer3', './assets/images/background/originals/backgroundLayer3.png');
        this.load.image('backgroundLayer3b', './assets/images/background/originals/backgroundLayer3b.png');

        // this.load.image('backgroundLayer0', './assets/images/background/rescaledCompressed/backgroundLayer0.png');
        // this.load.image('backgroundLayer0b', './assets/images/background/rescaledCompressed/backgroundLayer0b.png');
        // this.load.image('backgroundLayer1', './assets/images/background/rescaledCompressed/backgroundLayer1.png');
        // this.load.image('backgroundLayer1b', './assets/images/background/rescaledCompressed/backgroundLayer1b.png');
        // this.load.image('backgroundLayer2', './assets/images/background/rescaledCompressed/backgroundLayer2.png');
        // this.load.image('backgroundLayer2b', './assets/images/background/rescaledCompressed/backgroundLayer2b.png');
        // this.load.image('backgroundLayer3', './assets/images/background/rescaledCompressed/backgroundLayer3.png');
        // this.load.image('backgroundLayer3b', './assets/images/background/rescaledCompressed/backgroundLayer3b.png');

        //background prebuilt
        this.load.image('background', './assets/images/background/originals/background.png');
        this.load.image('background2', './assets/images/background/originals/background2.png');

        //all character sprites
        this.load.atlas('characterAtlas', 'assets/images/characters/characterAtlas.png', 'assets/json/characterAtlas.json');
        this.load.json('characterAtlasData', 'assets/json/characterAtlas.json');
        //bounding vertex information for the character
        this.load.json('characterShapes', 'assets/json/characterVerticies.json');

        //tilemap
        this.load.image("tiles", "assets/images/tilesets/snowyRocks.png");
        //this.load.tilemapTiledJSON("map", "assets/json/snowForestMap.json");
        this.load.tilemapTiledJSON('map', 'assets/json/newnewnew.json');

        //audio
        this.load.audio('floorAmbience', 'assets/audio/loop.mp3');
        this.load.audio('steps', 'assets/audio/2step.mp3');
        this.load.audio('jump', 'assets/audio/jump.mp3');
        this.load.audio('wallSlide', 'assets/audio/wallSlide.mp3');
        
    }

    create()
    {
        this.scene.start('mountainScene');
    }
}