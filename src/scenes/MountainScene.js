import Phaser from 'phaser';


const addTrees = (scene, viewHeight, treeScaleFactor) => {
    scene.add.image(200, viewHeight, 'tree1')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(0.6, 1);
    scene.add.image(600, viewHeight, 'tree2')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(.75, 1);
    scene.add.image(800, viewHeight, 'tree1')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(0.6, 1);
    scene.add.image(900, viewHeight, 'tree2')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(.75, 1);
    scene.add.image(1100, viewHeight, 'tree1')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(0.6, 1);
    scene.add.image(1290, viewHeight, 'tree2')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(.75, 1);
    scene.add.image(1600, viewHeight, 'tree2')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(.75, 1);
    scene.add.image(1700, viewHeight, 'tree2')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(.75, 1);
    scene.add.image(1800, viewHeight, 'tree1')
        .setOrigin(0,1)
        .setScale(treeScaleFactor)
        .setScrollFactor(0.6, 1);
}

export default class MountainScene extends Phaser.Scene
{
	constructor()
	{
        super('mountainScene');
	}

	preload()
    {
        this.load.image('mountainBackground', './assets/background/abc2.png');
        this.load.image('dirtSkinny', './assets/textures/yellowGrassGround.png');
        this.load.image('ground', './assets/textures/yellowGrassGround.png');
        this.load.image('tree1', './assets/trees/pixelTree1.png');
        this.load.image('tree2', './assets/trees/pixelTree2.png');
        this.load.image('player', './assets/characters/player/old-man-sheet.png');
        this.load.spritesheet('oldMan', './assets/characters/player/old-man-sheet.png', { frameWidth: 493, frameHeight:  1099})
        //this.load.spritesheet('oldMan', './assets/characters/player/platformer_sprites_base_0.png', { frameWidth: 28, frameHeight: 28 })
        
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        //set up camera view 
        const viewWidth = this.scale.width;
        const viewHeight = this.scale.height;

        const backgroundScaleFactor = 0.8;
        const treeScaleFactor = 0.3;
        const backgroundHeight = this.textures.get('mountainBackground').getSourceImage().height * backgroundScaleFactor;
        const backgroundWidth = this.textures.get('mountainBackground').getSourceImage().width * backgroundScaleFactor;
        this.cameras.main.setBounds(0, -1*(backgroundHeight-viewHeight), backgroundWidth, backgroundHeight);

        this.add.image(0, viewHeight, 'mountainBackground')
            .setOrigin(0,1)
            .setScale(backgroundScaleFactor)
            .setScrollFactor(0.1, .1);

        addTrees(this, viewHeight, treeScaleFactor);

        this.player = this.physics.add.sprite(0, viewHeight-50, 'oldMan', 0)
            .setOrigin(0,1)
            .setScale(.15); 

        this.cameras.main.startFollow(this.player);

        this.ground = this.physics.add.staticImage(0, viewHeight-10, 'dirtSkinny')
            .setOrigin(0,0)
            .refreshBody();

        this.physics.add.collider(this.player, this.ground);


        //  Our player animations, turning, walking left and walking right.


        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('oldMan', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('oldMan', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update()
    {
        //const cam = this.cameras.main;
        const speed = 100;
        const jumpHeight = 300;
        if (this.cursors.left.isDown)
        {
            this.player.setScale(-0.15, 0.15);
            this.player.anims.play('walk', true);
            this.player.setVelocityX(-1*speed);

            
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setScale(0.15);
            this.player.anims.play('walk', true);
            this.player.setVelocityX(speed);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('idle');
            
            //this.player.anims.play('turn');
        }
    
        // if (this.cursors.up.isDown && this.player.body.touching.down)
        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-1*jumpHeight);
        }
    }
}
