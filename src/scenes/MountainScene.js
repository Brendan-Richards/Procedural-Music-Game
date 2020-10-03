import Phaser from 'phaser';
import makeCharacterAnimations from '../Animations/CharacterAnimations';
//import Matter from 'matter'


const handlePlayerCollision = (scene) => {

}

export default class MountainScene extends Phaser.Scene
{
	constructor()
	{
        super('mountainScene');
	}

    create()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.characterCanJump = false;
        //const obj = {left: true, right: false, top: false, bottom: true};
        //this.matter.world.setBounds(0, this.scale.height, 0, 0, 64, true, false, false, true)

        //set up camera view 
        //const viewWidth = this.scale.width;
        //const viewHeight = this.scale.height;
        //this.cameras.main.setZoom(4);
        const bounds = this.cameras.main.worldView;

        const backgroundScaleFactor = 1;
        //const backgroundScrollFactor = 1;
        //const treeScaleFactor = 0.3;
        const backgroundHeight = this.textures.get('mountainBackground').getSourceImage().height * backgroundScaleFactor;
        const backgroundWidth = this.textures.get('mountainBackground').getSourceImage().width * backgroundScaleFactor;
        console.log(backgroundWidth, backgroundHeight);
      //this.cameras.main.setBounds(0, 0, backgroundWidth, backgroundHeight);
        //this.cameras.main.setBounds(0, 0, this.scale.gameSize.width, this.scale.gameSize.height);

        this.add.image(0, this.scale.height, 'mountainBackground').setOrigin(0,1)
    //        .setOrigin(0,1)
  //          .setScale(backgroundScaleFactor)
      //      .setScrollFactor(1);
       // const obj = {x: 0, y: this.scale.height, left: true, right: false, top: false, bottom: true};
        //this.matter.world.setBounds(0, this.scale.height, 0, 0, 64, true, false, false, true);
        
        this.grass = this.matter.add.sprite(0, 0, 'grass', undefined, {
            isStatic: true,
            render: { sprite: { xOffset: 0, yOffset: 0.5 } }
        });
        //this.grass.setPosition(this.grass.centerOfMass.x-100, this.grass.centerOfMass.y-100);

        this.grass.setPosition(this.grass.width/2, this.game.scale.gameSize.height);
        console.log(this.grass.width, this.grass.height)
    //     this.rockWall1 = this.physics.add.staticSprite(backgroundWidth, backgroundHeight, 'rockWall1')
    //         .setOrigin(1,1)
    //         .refreshBody();

    
        makeCharacterAnimations(this);

        //const runFrames = this.cache.json.get('run-frames');
        this.playerScaleFactor = 2.5;
        this.player = this.matter.add.sprite(100, 100, 'characterAtlas')
            .play('idle1')
            .setScale(this.playerScaleFactor);
        this.player.setFriction(0);
        handlePlayerCollision(this);
        this.player.setOnCollide(data => {
            console.log(data.collision.axisNumber);
            console.log(data);
            let {x, y} = data.collision.normal;
            if(x===0 && y===1){
                console.log('collided with floor');
            }
            else if(x===-1 && y===0){
                console.log('collided with left wall');
            }
            else if(x===0 && y===-1){
                console.log('collided with ceiling');
            }
            else if(x===1 && y===0){
                console.log('collided with right wall');
            }
            else{
                console.log('I dont know what you collided with');
            }
          });

       
        //   this.cameras.main.startFollow(this.player, false, 0.09, 0.09);
            //ground.setPosition(0 + ground.centerOfMass.x, 280 + ground.centerOfMass.y); 

    //    // 
        
    //     console.log(this.cameras.main.worldView)

          //this.matter.add.
        //this.physics.add.collider(this.player, this.grass);
    //     this.physics.add.collider(this.player, this.rockWall1);



        // this.matter.world.on("collisionactive", (this.player, this.grass) => {
        //     this.characterCanJump = true;
        // });
    }

    update()
    {
        //const cam = this.cameras.main;
        const speed = 6;
        const jumpHeight = 5;

        if (this.cursors.left.isDown)
        {
            this.player.setScale(-this.playerScaleFactor, this.playerScaleFactor);
            this.player.play('run', true);
            this.player.setVelocityX(-1*speed);

            
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setScale(this.playerScaleFactor);
            this.player.play('run', true);
            this.player.setVelocityX(speed);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.play('idle1', true);
            
            //this.player.anims.play('turn');
        }
    
        //if (this.cursors.up.isDown && this.player.body.touching.down)
        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-1*jumpHeight);
        }

        this.player.setFixedRotation();
    }
}
