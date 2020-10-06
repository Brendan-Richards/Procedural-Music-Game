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

        this.grass = this.matter.add.sprite(0, 0, 'grass', undefined, {
            isStatic: true,
            label: 'ground',
            render: { sprite: { xOffset: 0, yOffset: 0.5 } }
        });

        this.grass.setPosition(this.grass.width/2, this.game.scale.gameSize.height);
        this.grass.setScale(6, 1);
        
        this.rect1 = this.matter.add.image(this.grass.width*2, this.game.scale.gameSize.height/2, 'verticalStrip', null, {
            isStatic: true,
            label: 'wall'
        });
        this.rect2 = this.matter.add.image(100, this.game.scale.gameSize.height/2, 'verticalStrip', null, {
            isStatic: true,
            label: 'wall'
        });
    
        makeCharacterAnimations(this);

        this.createPlayer();

        //collision between player, ground, and wall
        this.matter.world.on("collisionstart", event => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if(bodyA.gameObject===this.player || bodyB.gameObject===this.player){
                    const other = bodyA.gameObject===this.player ? bodyB.gameObject : bodyA.gameObject;
                    if(other!==null){
                       // console.log(other.body.label);
                        //console.log(other);
                        if(other.body.label==='ground'){
                            this.playerCanJump = true;
                            this.playerWallSliding = false;
                        }
                        else if(other.body.label==='wall'){
                            this.playerWallSliding = true;
                        }
                    }
                }
            });
          });


    }

    update()
    {
        const speed = 6;
        const jumpHeight = 20;
        const prevVelocity = this.player.body.velocity;

        if(this.playerCanJump){
            this.groundCharacter(speed, jumpHeight, prevVelocity);
        }
        else{
            this.airborneCharacter(speed, prevVelocity);
        }
        this.player.setFixedRotation();   
    }

    groundCharacter(speed, jumpHeight, prevVelocity){

        // set the animation
        if (this.controlConfig.jumpControl.isDown && this.controlConfig.jumpControl.timeDown > this.prevJumpTime)
        {
            this.setNewCharacterAnimation(this, 'jump', this.currentPlayerDirection==='left', false);   
            this.playerCanJump = false;
            this.prevJumpTime = this.controlConfig.jumpControl.timeDown;
            //console.log('jump time:', this.prevJumpTime);
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
                    this.matter.setVelocity(this.player.body, speed, prevVelocity.y);
                    break;
                }
                else if(this.currentPlayerDirection==='left'){
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

        if(this.playerWallJumping){
            const tolerance = 130;

            const prevX = this.wallJumpOffPosition.x;
            const prevY = this.wallJumpOffPosition.y;
            const currX = this.playerBody.position.x;
            const currY = this.playerBody.position.y;
            //console.log('prevX:', prevX, 'prevY:', prevY, 'currX:', currX, 'currY:', currY);
            const distance = Math.sqrt(Math.pow(currX-prevX, 2) + Math.pow(currY-prevY, 2));
            //console.log('distance from wall: ', distance);
            //console.log('current seconds:', new Date().getSeconds());

            if(distance > tolerance){
                this.playerWallJumping = false;
            }
        }
        else if(this.playerWallSliding){
            if(this.currentPlayerAnimation!=='wallSlide'){
                this.playerFriction = .5;
                this.setNewCharacterAnimation(this, 'wallSlide', this.currentPlayerDirection==='left', false);
            }
            if(this.controlConfig.jumpControl.isDown && this.controlConfig.jumpControl.timeDown > this.prevJumpTime){
                //console.log('jump off wall');
                //flip the players direction cause they were facing the opposite way when on the wall
                this.currentPlayerDirection = this.currentPlayerDirection==='left' ? 'right' : 'left';
                this.setNewCharacterAnimation(this, 'jump', this.currentPlayerDirection==='left', false); 
                const x = this.currentPlayerDirection==='left' ? -1 : 1;
                this.matter.setVelocity(this.player.body, x*speed, -2.5*speed);  
                this.playerCanJump = false;        
                this.playerWallSliding = false;   
                this.playerWallJumping = true;  
                this.wallJumpOffPosition = {...this.playerBody.position};  
                this.prevJumpTime = this.controlConfig.jumpControl.timeDown;
                //console.log('jujst set player wall jump position as:', this.wallJumpOffPosition);
            }
            else{
                if(this.controlConfig.leftControl.isDown && this.currentPlayerDirection!=='left' ||
                   this.controlConfig.rightControl.isDown && this.currentPlayerDirection!=='right' ||
                   !this.controlConfig.rightControl.isDown && !this.controlConfig.leftControl.isDown){
                       //console.log('stopping wall slide');
                       this.playerFriction = 0;
                       //flip the players direction cause they were facing the opposite way when on the wall
                       this.stopWallSlidingDirection = this.currentPlayerDirection;
                       this.currentPlayerDirection = this.currentPlayerDirection==='left' ? 'right' : 'left';
                       this.setNewCharacterAnimation(this, 'fall', this.currentPlayerDirection==='left', false);
                       this.playerWallSliding = false;
                       this.stopWallSlidingPosition = {...this.playerBody.position}
                      //console.log('set stop wall sliding position to:', this.stopWallSlidingPosition);
                   }
            }

        }
        else if(!this.playerWallJumping){
            if(prevVelocity.y >= 0){
                if (this.controlConfig.leftControl.isDown)
                {
                    //console.log('checking if player can start wall sliding again at position:', this.playerBody.position);
                    if(this.playerBody.position.x===this.stopWallSlidingPosition.x &&
                       this.stopWallSlidingDirection==='left'){
                            //console.log('resetting wall slide to left wall');
                            this.playerWallSliding = true;
                    }
                    else if(!(this.currentPlayerAnimation==='fall' && this.currentPlayerDirection==='left')){
                        this.setNewCharacterAnimation(this, 'fall', true, false);
                    }
                }
                else if (this.controlConfig.rightControl.isDown)
                {
                    //console.log('checking if player can start wall sliding again at position:', this.playerBody.position);
                    if(this.playerBody.position.x===this.stopWallSlidingPosition.x &&
                       this.stopWallSlidingDirection==='right'){
                            //console.log('resetting wall slide to right wall');
                            this.playerWallSliding = true;
                     }
                    else if(!(this.currentPlayerAnimation==='fall' && this.currentPlayerDirection==='right')){
                        this.setNewCharacterAnimation(this, 'fall', false, false);        
                    }
                }
                else{
                    this.setNewCharacterAnimation(this, 'fall', this.currentPlayerDirection==='left', false);
                }
            }
            else{// player is still moving up
                if (this.controlConfig.rightControl.isDown)
                {
                    if(!(this.currentPlayerAnimation==='jump' && this.currentPlayerDirection==='right')){
                        //console.log('still moving up and trying to set to jump right animation');
                        this.setNewCharacterAnimation(this, 'jump', false, false);        
                    }
                }       
                else if (this.controlConfig.leftControl.isDown)
                {
                    if(!(this.currentPlayerAnimation==='jump' && this.currentPlayerDirection==='left')){
                        //console.log('still moving up and trying to set to jump left animation');
                        this.setNewCharacterAnimation(this, 'jump', true, false);
                    }
                }    
            }
        }
 

    
        //set the characters speed depending on the active animation and active direction
        switch(this.currentPlayerAnimation){
            case 'wallSlide': {
                this.matter.setVelocity(this.player.body, 0, prevVelocity.y);
                break;
            }
            case 'fall': {
                if(this.currentPlayerDirection==='right' && this.controlConfig.rightControl.isDown){
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
            }
            case 'jump': {
                if(this.controlConfig.rightControl.isDown && !this.playerWallJumping){
                    this.currentPlayerDirection = 'right';
                    this.matter.setVelocity(this.player.body, speed, prevVelocity.y);
                    break;
                }
                else if(this.controlConfig.leftControl.isDown && !this.playerWallJumping){
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
            case 'jump': {bodyData = scene.characterShapes.adventurer_jump_up_00; break;}
            case 'fall': {bodyData = scene.characterShapes.adventurer_fall_00; break;}
            case 'smrslt': {bodyData = scene.characterShapes.adventurer_smrslt_00; break;}
            case 'wallSlide': {bodyData = scene.characterShapes.adventurer_wall_slide_00; break;}
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
        this.playerBody = this.matter.add.fromPhysicsEditor(800, 600, this.characterShapes.adventurer_idle_00, null, false);
        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');
        this.player.setExistingBody(this.playerBody);
        this.player.setScale(this.playerScaleFactor);
        this.playerFriction = 0;
        this.currentPlayerAnimation = null;
        this.currentPlayerDirection = 'right'
        this.prevPlayerDirection = null;
        this.cameras.main.startFollow(this.player, false, 0.09, 0.09);
        this.playerWallSliding = false;
        this.playerWallJumping = false;
        this.wallJumpOffPosition = null;
        this.secondsSinceLastWallJump = 0;
        this.wallSlidePositionX = null;
        this.prevJumpTime = -1;
        this.stopWallSlidingPosition = {x:0, y:0};
        this.stopWallSlidingDirection = null;
    }
}
