import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('preloader');
    }

    preload()
    {
        this.load.image('mountainBackground', './assets/images/background/abc.png');
        this.load.image('rockWall1', './assets/images/environment/rockWall1.png');
        this.load.image('grass', './assets/images/environment/grass.png');
        this.load.spritesheet('adventurer', './assets/images/characters/adventurerSheet.png', { frameWidth: 50, frameHeight:  37});

        //all character sprites
        this.load.atlas('characterAtlas', 'assets/images/characters/characterAtlas.png', 'assets/json/characterAtlas.json');
        this.load.json('characterAtlasData', 'assets/json/characterAtlas.json');
        //bounding vertex information for the character
        this.load.json('characterShapes', 'assets/json/characterVerticies.json');
    }

    create()
    {
        this.scene.start('mountainScene');
    }
}