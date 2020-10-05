import Phaser from 'phaser';
import makeCharacterAnimations from '../Animations/CharacterAnimations';


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
        this.characterShapes = this.cache.json.get('characterShapes');
        this.playerCanJump = true;
        this.cursors = this.input.keyboard.createCursorKeys();
        //this.input.keyboard.sceneInputPlugin.keyboard.addKeys();

        this.controlConfig = {
            leftControl: this.cursors.left,
            rightControl: this.cursors.right,
            jumpControl: this.cursors.space
        }
        
        this.characterCanJump = false;

        const backgroundScaleFactor = 1;
        const backgroundHeight = this.textures.get('mountainBackground').getSourceImage().height * backgroundScaleFactor;
        const backgroundWidth = this.textures.get('mountainBackground').getSourceImage().width * backgroundScaleFactor;
      
        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, backgroundWidth, this.game.scale.gameSize.height, 64);
        this.cameras.main.setBounds(0, 0, backgroundWidth, this.game.scale.gameSize.height);

            //add background image
        this.add.image(0, this.scale.height, 'mountainBackground').setOrigin(0,1);

        //this.matter.add.
     
        this.grass = this.matter.add.sprite(0, 0, 'grass', undefined, {
            isStatic: true,
            render: { sprite: { xOffset: 0, yOffset: 0.5 } }
        });

        this.grass.setPosition(this.grass.width/2, this.game.scale.gameSize.height);
        this.grass.setScale(6, 1);
        console.log(this.grass.width, this.grass.height)
    //     this.rockWall1 = this.physics.add.staticSprite(backgroundWidth, backgroundHeight, 'rockWall1')
    //         .setOrigin(1,1)
    //         .refreshBody();
        
    
        makeCharacterAnimations(this);

        this.createPlayer();
        this.currentPlayerDirection = 'right'
        this.prevPlayerDirection = null;
        this.cameras.main.startFollow(this.player, false, 0.09, 0.09);

        //this.physics.add.collider(this.player, this.grass);
        //this.physics.add.collider(this.player, this.rockWall1);



        // this.matter.world.on("collisionactive", (this.player, this.grass) => {
        //     this.characterCanJump = true;
        // });

        // this.player.on('animationcomplete', (AnimationData) => {
        //     if(AnimationData.key==='jump'){
        //        // this.setNewCharacterAnimation(this, 'fall', this.currentPlayerDirection==='left', false);
        //         this.characterJumping = false;
        //     }
        // });

        
        this.matter.world.on("collisionstart", event => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if(bodyA.gameObject===this.player || bodyB.gameObject===this.player){
                    //const plr = bodyA.gameObject===this.player ? bodyA : bodyB;
                    const other = bodyA.gameObject===this.player ? bodyB.gameObject : bodyA.gameObject;
                    if(other===this.grass){
                        this.playerCanJump = true;
                    }

                }
                //  console.log(bodyA);
                //  console.log(bodyB);
            });
          });

        //   this.matter.world.on("collisionend", event => {
        //     event.pairs.forEach(pair => {
        //         const { bodyA, bodyB } = pair;
        //         // if(bodyA.gameObject===this.player || bodyB.gameObject===this.player){
        //         //     //const plr = bodyA.gameObject===this.player ? bodyA : bodyB;
        //         //     const other = bodyA.gameObject===this.player ? bodyB.gameObject : bodyA.gameObject;
        //         //     if(other===null){
        //         //         this.playerCanJump = false;
        //         //     }

        //         // }
        //     });
        //   });

    }

    update()
    {
        const speed = 6;
        const jumpHeight = 20;
        const prevVelocity = this.player.body.velocity;
        //console.log(this.prevPlayerAnimation)

        if(this.playerCanJump){
            this.groundCharacter(speed, jumpHeight, prevVelocity);
        }
        else{
            //if(!this.characterJumping){
            this.airborneCharacter(speed, prevVelocity);
           // }
           // console.log('player not on the ground');
        }
       // console.log('player velocity: ', this.player.body.velocity.x, this.player.body.velocity.y);
        this.player.setFixedRotation(); 
       // console.log(this.player.body.velocity);   
    }

    groundCharacter(speed, jumpHeight, prevVelocity){

        // set the animation
        if (this.controlConfig.jumpControl.isDown)
        {
            this.setNewCharacterAnimation(this, 'jump', this.currentPlayerDirection==='left', false);   
            this.playerCanJump = false;
            //this.characterJumping = true;     
        }        
        else if (this.controlConfig.leftControl.isDown)
        {
            if(!(this.currentPlayerAnimation==='run' && this.currentPlayerDirection==='left')){
                this.setNewCharacterAnimation(this, 'run', true, false);
            }
        }
        else if (this.controlConfig.rightControl.isDown)
        {
            if(!(this.currentPlayerAnimation==='run' && this.currentPlayerDirection==='right')){
                this.setNewCharacterAnimation(this, 'run', false, false);        
            }
        }
        else
        {
            if(this.currentPlayerAnimation!=='idle1'){
                this.setNewCharacterAnimation(this, 'idle1', this.currentPlayerDirection==='left', false);
            }
        }
    
        //set the characters speed depending on the active animation and active direction
        switch(this.currentPlayerAnimation){
            case 'idle': {
                this.matter.setVelocity(this.player.body, 0, prevVelocity.y);
                break;
            }
            case 'run': {
                if(this.currentPlayerDirection==='right'){
                    //this.player.setVelocityX(speed);
                    this.matter.setVelocity(this.player.body, speed, prevVelocity.y);
                    break;
                }
                else if(this.currentPlayerDirection==='left'){
                    //this.player.setVelocityX(-1*speed);
                    this.matter.setVelocity(this.player.body, -1*speed, prevVelocity.y);
                    break;
                }
                else{
                    console.log("don't understand previous character direction");
                    break;
                }
            }
            case 'jump': {
                this.matter.setVelocity(this.player.body, prevVelocity.x, -1*jumpHeight);
                break;
            } 
            default: break;
        }
    }

    airborneCharacter(speed, prevVelocity){


        if (this.controlConfig.leftControl.isDown)
        {
            if(!(this.currentPlayerAnimation==='fall' && this.currentPlayerDirection==='left')){
                this.setNewCharacterAnimation(this, 'fall', true, false);
            }
        }
        else if (this.controlConfig.rightControl.isDown)
        {
            if(!(this.currentPlayerAnimation==='fall' && this.currentPlayerDirection==='right')){
                this.setNewCharacterAnimation(this, 'fall', false, false);        
            }
        }
    
        
    
        //set the characters speed depending on the active animation and active direction
        switch(this.currentPlayerAnimation){
            case 'fall': if(this.currentPlayerDirection==='right' && this.controlConfig.rightControl.isDown){
                this.matter.setVelocity(this.player.body, speed, prevVelocity.y);
                break;
            }
            else if(this.currentPlayerDirection==='left' && this.controlConfig.leftControl.isDown){
                this.matter.setVelocity(this.player.body, -1*speed, prevVelocity.y);
                break;
            }
            else{
                this.matter.setVelocity(this.player.body, 0, prevVelocity.y);
                break;
            }
            case 'jump': {
                //console.log('here');
                if(this.controlConfig.rightControl.isDown){
                    this.currentPlayerDirection = 'right';
                    this.matter.setVelocity(this.player.body, speed, prevVelocity.y);
                    break;
                }
                else if(this.controlConfig.leftControl.isDown){
                    this.currentPlayerDirection = 'left';
                    this.matter.setVelocity(this.player.body, -1*speed, prevVelocity.y);
                    break;
                }
            }
            default: break;
        }
    }

    setNewCharacterAnimation = (scene, animationName, flipX, flipY) => {
        scene.player.setScale(1);

        let bodyData = null;
        switch(animationName){
            case 'idle1': {bodyData = scene.characterShapes.adventurer_idle_00; break;}
            case 'run': {bodyData = scene.characterShapes.adventurer_run_00; break;}
            case 'jump': {bodyData = scene.characterShapes.adventurer_jump_00; break;}
            case 'fall': {bodyData = scene.characterShapes.adventurer_fall_00; break;}
            case 'smrslt': {bodyData = scene.characterShapes.adventurer_smrslt_00; break;}
            default: break;
        }

        scene.playerBody = scene.matter.add.fromPhysicsEditor(scene.player.x, scene.player.y, bodyData, null, false);
        scene.playerBody.friction = scene.playerFriction;
        scene.player.setExistingBody(scene.playerBody);

        scene.player.setScale((flipX ? -1 : 1)*scene.playerScaleFactor, 
                              (flipY ? -1 : 1)*scene.playerScaleFactor);

        scene.player.play(animationName, true);
        scene.prevPlayerAnimation = scene.currentPlayerAnimation;
        scene.currentPlayerAnimation = animationName;

        scene.prevPlayerDirection = scene.currentPlayerDirection;
        scene.currentPlayerDirection = flipX ? 'left' : 'right';
    }

    createPlayer = () => {
        this.playerScaleFactor = 2.5;
    
        this.playerBody = this.matter.add.fromPhysicsEditor(100, 100, this.characterShapes.adventurer_idle_00, null, false);
        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer-idle-00.png');
        this.player.setExistingBody(this.playerBody);
    
        this.player.setScale(this.playerScaleFactor);
        this.playerFriction = 0;
        this.currentPlayerAnimation = null;
    

        // this.player.setOnCollide(data => {
        //     //console.log(data.collision.axisNumber);
        //     console.log(data);
        //     let {x, y} = data.collision.normal;
        //     if(x===0 && y===1){
        //         console.log('collided with floor');
        //     }
        //     else if(x===-1 && y===0){
        //         console.log('collided with left wall');
        //     }
        //     else if(x===0 && y===-1){
        //         console.log('collided with ceiling');
        //     }
        //     else if(x===1 && y===0){
        //         console.log('collided with right wall');
        //     }
        //     else{
        //         console.log('I dont know what you collided with');
        //     }
        //   });
    }
}
