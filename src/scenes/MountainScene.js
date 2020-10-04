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
        this.characterShapes = this.cache.json.get('characterShapes');
        this.playerOnGround = true;
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.characterCanJump = false;

        const backgroundScaleFactor = 1;
        const backgroundHeight = this.textures.get('mountainBackground').getSourceImage().height * backgroundScaleFactor;
        const backgroundWidth = this.textures.get('mountainBackground').getSourceImage().width * backgroundScaleFactor;
      
        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, backgroundWidth, this.game.scale.gameSize.height, 4);
        this.cameras.main.setBounds(0, 0, backgroundWidth, this.game.scale.gameSize.height);

            //add background image
        this.add.image(0, this.scale.height, 'mountainBackground').setOrigin(0,1);
     
        this.grass = this.matter.add.sprite(0, 0, 'grass', undefined, {
            isStatic: true,
            render: { sprite: { xOffset: 0, yOffset: 0.5 } }
        });

        this.grass.setPosition(this.grass.width/2, this.game.scale.gameSize.height);
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

        this.player.on('animationcomplete', (AnimationData) => {
            if(AnimationData.key==='jump'){
                this.setNewCharacterAnimation(this, 'fall', this.currentPlayerDirection==='left', false);
                this.characterJumping = false;
            }
        })

        // this.anims.create({
        //     key: 'jump',
        //     frames: this.anims.generateFrameNames('characterAtlas', {
        //          prefix: 'adventurer-jump-', 
        //          suffix: '.png',
        //          end: 4, 
        //          zeroPad: 2 
        //         }),
        //         frameRate: 10,
        //     repeat: 0,
        //     yoyo: true
        // });        

    }

    update()
    {
        const speed = 6;
        const jumpHeight = 20;

        if(this.playerOnGround){
            this.groundCharacter(speed, jumpHeight);
        }
        else{
            if(!this.characterJumping){
                this.airborneCharacter(speed);
            }
            console.log('player not on the ground');
        }
        console.log('player velocity: ', this.player.body.velocity.x, this.player.body.velocity.y);
        this.player.setFixedRotation();    
    }

    groundCharacter(speed, jumpHeight){
        // set the animation
        if (this.cursors.up.isDown)
        {
            this.setNewCharacterAnimation(this, 'jump', this.currentPlayerDirection==='left', false);   
            this.playerOnGround = false;
            this.characterJumping = true;     
        }        
        else if (this.cursors.left.isDown)
        {
            if(!(this.currentPlayerAnimation==='run' && this.currentPlayerDirection==='left')){
                this.setNewCharacterAnimation(this, 'run', true, false);
            }
        }
        else if (this.cursors.right.isDown)
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
            case 'idle': {this.player.setVelocityX(0); break;}
            case 'run': {
                if(this.currentPlayerDirection==='right'){
                    this.player.setVelocityX(speed);
                    break;
                }
                else if(this.currentPlayerDirection==='left'){
                    this.player.setVelocityX(-1*speed);
                    break;
                }
                else{
                    console.log("don't understand previous character direction");
                    break;
                }
            }
            case 'jump': {
                //this.player.setVelocityY(-1*jumpHeight);
                //Phaser.Physics.Matter.MatterPhysics.body.setVelocity( this.player.body, {x: 10, y: -10});
                
                this.player.setVelocityX( this.player.body.velocity.x);
                this.player.setVelocityY(-1*jumpHeight);
                break;
            } 
            default: break;
        }
    }

    airborneCharacter(speed){
        if (this.cursors.left.isDown)
        {
            if(!(this.currentPlayerAnimation==='fall' && this.currentPlayerDirection==='left')){
                this.setNewCharacterAnimation(this, 'fall', true, false);
            }
        }
        else if (this.cursors.right.isDown)
        {
            if(!(this.currentPlayerAnimation==='fall' && this.currentPlayerDirection==='right')){
                this.setNewCharacterAnimation(this, 'fall', false, false);        
            }
        }
    
        //set the characters speed depending on the active animation and active direction
        switch(this.currentPlayerAnimation){
            case 'fall': if(this.currentPlayerDirection==='right'){
                this.player.setVelocityX(speed);
                break;
            }
            else if(this.currentPlayerDirection==='left'){
                this.player.setVelocityX(-1*speed);
                break;
            }
            else{
                console.log("don't understand previous character direction");
                break;
            }
            default: break;
        }
    }

    setNewCharacterAnimation = (scene, animationName, flipX, flipY) => {
        scene.player.setScale(1);

        let bodyData = null;
        switch(animationName){
            case 'idle1': bodyData = scene.characterShapes.adventurer_idle_00; break;
            case 'run': bodyData = scene.characterShapes.adventurer_run_00; break;
            case 'jump': bodyData = scene.characterShapes.adventurer_jump_00; break;
            case 'fall': bodyData = scene.characterShapes.adventurer_fall_00; break;
            default: break;
        }

        scene.playerBody = scene.matter.add.fromPhysicsEditor(scene.player.x, scene.player.y, bodyData, null, false);
        scene.playerBody.friction = scene.playerFriction;
        scene.player.setExistingBody(scene.playerBody);

        const x = flipX ? -1 : 1;
        const y = flipY ? -1 : 1; 
        scene.player.setScale(x*scene.playerScaleFactor, y*scene.playerScaleFactor);

        scene.player.play(animationName, true);
        scene.prevPlayerAnimation = scene.currentPlayerAnimation;
        scene.currentPlayerAnimation = animationName;

        scene.prevPlayerDirection = scene.currentPlayerDirection;
        scene.currentPlayerDirection = flipX ? 'left' : 'right';
    }

    createPlayer = () => {
        this.playerScaleFactor = 2.5;
    
        this.playerBody = this.matter.add.fromPhysicsEditor(100, 100, this.characterShapes.adventurer_idle_00, null, false);
        //console.log(scene.playerBody);
        //console.log(typeof scene.playerBody);
        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer-idle-00.png');
        this.player.setExistingBody(this.playerBody);
    
        this.player.setScale(this.playerScaleFactor);
        this.playerFriction = 0;
        this.currentPlayerAnimation = null;
    

        this.player.setOnCollide(data => {
            //console.log(data.collision.axisNumber);
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
    }
}
