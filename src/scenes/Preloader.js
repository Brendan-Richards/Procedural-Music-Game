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
        //this.load.image('dirtSkinny', './assets/images/textures/dirtSkinny.jpg');
        this.load.image('rockWall1', './assets/images/environment/rockWall1.png');
        this.load.image('grass', './assets/images/environment/grass.png');
        // this.load.image('tree2', './assets/trees/pixelTree2.png');
        this.load.spritesheet('adventurer', './assets/images/characters/adventurerSheet.png', { frameWidth: 50, frameHeight:  37});

        this.load.atlas('characterAtlas', 'assets/images/characters/characterAtlas.png', 'assets/images/characters/characterAtlasJson.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('characterAtlasFrames', 'assets/images/characters/characterAtlasJson.json');
    }

    create()
    {
        this.scene.start('mountainScene');
    }
}