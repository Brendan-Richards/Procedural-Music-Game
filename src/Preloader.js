import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('preloader');
    }

    preload()
    {
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

        //tilemap
        // this.load.tilemapTiledJSON('map', 'assets/json/blackPixelMap.json');
        // this.load.image("blackPixelTiles", "assets/images/tilesets/blackPixelTiles.png"); 

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

        //UI
        this.load.image("staminaOutline", "assets/images/UI/staminaOutline.png");
        this.load.image("staminaFill", "assets/images/UI/staminaFill.png");
        
    }

    create()
    {
        this.scene.start('mountainScene');
    }
}