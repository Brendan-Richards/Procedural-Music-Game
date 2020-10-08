import Phaser from 'phaser';
import makeCharacterAnimations from '../Animations/CharacterAnimations';


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

        this.CTRLDown = false;
        this.input.keyboard.on('keydown-' + 'CTRL', (event) => {
            this.CTRLDown = true;
        })
        this.input.keyboard.on('keyup-' + 'CTRL', (event) => {
            this.CTRLDown = false;
        })
        

        this.controlConfig = {
            leftControl: this.cursors.left,
            rightControl: this.cursors.right,
            jumpControl: this.cursors.space,
            groundSlide: {
                isDown: this.CTRLDown,
                isUp: !this.CTRLDown
            }
        }

        const maxGameHeight = 10000;
        const maxGameWidth = 20000;
      
        //set camera and world bounds 
        this.matter.world.setBounds(0, 0, maxGameWidth, maxGameHeight, 64, true, false, false, true);
        this.cameras.main.setBounds(0, 0, maxGameWidth, maxGameHeight);
        //this.cameras.main.setZoom(0.09);

        makeCharacterAnimations(this);

        this.backgroundType = 'sparse';
        this.createLevel(maxGameWidth, maxGameHeight);
        this.createPlayer(maxGameHeight);

        //collision between player, ground, and wall
        this.matter.world.on("collisionstart", event => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                //console.log(pair);
                if(bodyA.gameObject===this.player || bodyB.gameObject===this.player){
                    const other = bodyA.gameObject===this.player ? bodyB.gameObject : bodyA.gameObject;
                    if(other!==null){
                        if(other.tile.properties.collisionLabel==='ground'){
                            this.playerCanJump = true;
                            this.playerWallSliding = false;
                            if(this.playerRampSliding){
                                this.playerFlatSliding = true;
                                this.playerRampSliding = false;
                                this.setFlatSlide = false;
                            }
                            
                        }
                        else if(other.tile.properties.collisionLabel==='rightSlideable'){
                           // console.log('collided with rightSlidable');
                            this.playerRampSliding = true; 
                            this.playerGroundSlideDirection = 'right';
                            this.matter.setVelocity(this.player.body, this.player.body.velocity.y, this.player.body.velocity.y)
                            this.playerWallSliding = false;
                            this.playerCanJump = true;
                            this.playerWallJumping = false;
                            this.playerFlatSliding = false;
                        }
                        else if(other.tile.properties.collisionLabel==='leftSlideable'){
                            //console.log('collided with leftSlidable');
                            this.playerRampSliding = true; 
                            this.playerGroundSlideDirection = 'left';
                            this.matter.setVelocity(this.player.body, -1 * this.player.body.velocity.y, this.player.body.velocity.y)
                            this.playerWallSliding = false;
                            this.playerCanJump = true;
                            this.playerWallJumping = false;
                            this.playerFlatSliding = false;
                        }
                        else if(other.tile.properties.collisionLabel==='wall'){
                            this.playerWallSliding = true;
                            this.playerRampSliding = false;
                            this.playerFlatSliding = false;
                        }
                    }
                }
            });
          });

        //   this.matter.world.on("collisionend", event => {
        //     event.pairs.forEach(pair => {
        //         const { bodyA, bodyB } = pair;
        //         //console.log(pair);
        //         if(bodyA.gameObject===this.player || bodyB.gameObject===this.player){
        //             const other = bodyA.gameObject===this.player ? bodyB.gameObject : bodyA.gameObject;
        //             if(other!==null){
        //                 if(other.tile.properties.collisionLabel==='ground'){
        //                     this.playerCanJump = true;
        //                     this.playerGroundSliding = false;
        //                     this.playerWallSliding = false;
        //                 }
        //                 else if(other.tile.properties.collisionLabel==='slideable'){
        //                     //console.log('collided with slidable');
        //                     this.matter.setVelocity(this.player.body, this.player.body.velocity.x, 0);
        //                 }
        //             }
        //         }
        //     });
        //   });


    }

    update()
    {

        const prevVelocity = this.player.body.velocity;

        if(this.playerCanJump){
            this.groundCharacter(prevVelocity);
        }
        else{
            this.airborneCharacter(prevVelocity);
        }
        //console.log(this.currentPlayerAnimation);
         
    }

    groundCharacter(prevVelocity){

        // set the animation
        if (this.controlConfig.jumpControl.isDown && this.controlConfig.jumpControl.timeDown > this.prevJumpTime)
        {
            this.setNewCharacterAnimation(this, 'jump', this.currentPlayerDirection==='left', false);   
            this.playerCanJump = false;
            this.playerFlatSliding = false;
            this.playerRampSliding = false;
            this.prevJumpTime = this.controlConfig.jumpControl.timeDown;
            //console.log('jump time:', this.prevJumpTime);
        }  
        else if(this.playerRampSliding){
            if(this.currentPlayerAnimation!=='groundSlide'){
                this.playerFriction = 0;
                this.setNewCharacterAnimation(this, 'groundSlide', this.playerGroundSlideDirection==='left', false); 
                this.player.setAngle(this.playerGroundSlideDirection==='left' ? -45 : 45);
            }  
        }
        else if(this.playerFlatSliding){
            
            if(this.controlConfig.leftControl.isUp && this.controlConfig.rightControl.isUp){
                this.playerFriction = 0;
                this.setNewCharacterAnimation(this, 'groundSlide', this.currentPlayerDirection==='left', false); 
            }
            else{
                this.playerFlatSliding = false;
            }

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
                    this.matter.setVelocity(this.player.body, this.playerSpeed, prevVelocity.y);
                    break;
                }
                else if(this.currentPlayerDirection==='left'){
                    this.matter.setVelocity(this.player.body, -1*this.playerSpeed, prevVelocity.y);
                    break;
                }
                else{
                    console.log("don't understand previous character direction");
                    break;
                }
            }
            case 'jump': {
                
                if(this.prevPlayerAnimation==='idle1'){
                    this.matter.setVelocity(this.player.body, prevVelocity.x, -1*this.playerJumpHeight);
                }
                else{
                    const factor = this.currentPlayerDirection==='left' ? -1 : 1;
                    this.matter.setVelocity(this.player.body, factor*this.playerSpeed, -1*this.playerJumpHeight);
                    break;
                }
                break;
            } 
            case 'groundSlide': {
                // if(this.playerFlatSliding){
                //     const factor = this.currentPlayerDirection==='left' ? -1 : 1;
                //     this.matter.setVelocity(this.player.body, factor * Math.abs(prevVelocity.x), prevVelocity.y)
                // }
                // else{
                    const factor = this.playerGroundSlideDirection==='left' ? -1 : 1;
                    //console.log(prevVelocity);
                    //console.log(this.playerBody.friction);
                    this.matter.setVelocity(this.player.body, factor * Math.abs(prevVelocity.x), prevVelocity.y)
                //}

                break;
            }
            default: break;
        }
    }

    airborneCharacter(prevVelocity){

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
                this.matter.setVelocity(this.player.body, x*this.playerSpeed, -2.5*this.playerSpeed);  
                this.playerCanJump = false;        
                this.playerWallSliding = false;   
                this.playerWallJumping = true;  
                this.wallJumpOffPosition = {...this.playerBody.position};  
                this.prevJumpTime = this.controlConfig.jumpControl.timeDown;
                //console.log('jujst set player wall jump position as:', this.wallJumpOffPosition);
            }
            else{
                if(this.controlConfig.leftControl.isDown  && this.controlConfig.rightControl.isUp && this.currentPlayerDirection!=='left' ||
                   this.controlConfig.rightControl.isDown  && this.controlConfig.leftControl.isUp && this.currentPlayerDirection!=='right' ||
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
                    this.matter.setVelocity(this.player.body, this.playerSpeed, prevVelocity.y);
                    break;
                }
                else if(this.currentPlayerDirection==='left' && this.controlConfig.leftControl.isDown){
                    this.matter.setVelocity(this.player.body, -1*this.playerSpeed, prevVelocity.y);
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
                    this.matter.setVelocity(this.player.body, this.playerSpeed, prevVelocity.y);
                    break;
                }
                else if(this.controlConfig.leftControl.isDown && !this.playerWallJumping){
                    this.currentPlayerDirection = 'left';
                    this.matter.setVelocity(this.player.body, -1*this.playerSpeed, prevVelocity.y);
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
            case 'groundSlide': {bodyData = scene.characterShapes.adventurer_slide_00; break;}
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

        this.player.setBounce(0);
        scene.player.setFixedRotation();  
    }

    createPlayer = (gameHeight) => {
        this.playerScaleFactor = 1.7;
        this.playerSpeed = 6;
        this.playerJumpHeight = 12;
        this.playerBody = this.matter.add.fromPhysicsEditor(100, gameHeight-100, this.characterShapes.adventurer_idle_00, null, false);
        this.player = this.matter.add.sprite(100, 100, 'characterAtlas', 'adventurer_idle_00.png');
        this.player.setExistingBody(this.playerBody);
        this.player.setScale(this.playerScaleFactor);
        this.playerFriction = 0;
        this.currentPlayerAnimation = null;
        this.prevPlayerAnimation = null;
        this.currentPlayerDirection = 'right'
        this.prevPlayerDirection = null;
        
        //this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.player, false, 0.09, 0.09);

        this.flatSlideStartTime = null;
        this.playerGroundSlideDirection = null;
        this.setFlatSlide = false;
        this.playerRampSliding = false;
        this.playerFlatSliding = false;
        this.playerWallSliding = false;
        this.playerWallJumping = false;
        this.wallJumpOffPosition = null;
        this.prevJumpTime = -1;
        this.stopWallSlidingPosition = {x:0, y:0};
        this.stopWallSlidingDirection = null;

        console.log('created character at:', this.playerBody.position);
    }

    createLevel = (totalWidth, totalHeight) => {
        this.createBackground(totalWidth, totalHeight);
        this.createTrees(totalWidth, totalHeight);
        this.createTileMap(totalWidth, totalHeight);    
    }

    createBackground = (totalWidth, totalHeight) => {

        if(this.backgroundType==='sparse'){
            this.createBackgroundLayer('backgroundLayer0', 0.1, 1, totalWidth, totalHeight);
            this.createBackgroundLayer('backgroundLayer1', 0.2, 1, totalWidth, totalHeight);
            this.createBackgroundLayer('backgroundLayer2', 0.3, 1, totalWidth, totalHeight);
            this.createBackgroundLayer('backgroundLayer3', 0.4, 1, totalWidth, totalHeight);
        }
        else{
            this.createBackgroundLayer('backgroundLayer0b', 0.1, 1, totalWidth, totalHeight);
            this.createBackgroundLayer('backgroundLayer1b', 0.2, 1, totalWidth, totalHeight);
            this.createBackgroundLayer('backgroundLayer2b', 0.3, 1, totalWidth, totalHeight);
            this.createBackgroundLayer('backgroundLayer3b', 0.4, 1, totalWidth, totalHeight);
        }

    }

    createBackgroundLayer = (texture, scrollFactorX, scrollFactorY, totalWidth, totalHeight) => {
        const width = this.textures.get(texture).getSourceImage().width;
        const count = Math.ceil(totalWidth/width * scrollFactorX);
        console.log('width:', width, 'count:', count, 'totalWidth:', totalWidth, 'totalHeight', totalHeight);
        let x = 0;
        for(let i=0; i<count; ++i){
            let temp = this.add.image(x, totalHeight, texture)
                            .setScrollFactor(scrollFactorX, scrollFactorY)
                            .setOrigin(0,1);
            x += temp.width;
        }

    }

    createTileMap = (totalWidth, totalHeight) => {
       
        const map = this.make.tilemap({ key: "map" });

        const tileset = map.addTilesetImage("snowRocks", "tiles");
        
        console.log('map height', map.heightInPixels);
        console.log('map width', map.widthInPixels);

        const groundLayer = map.createDynamicLayer("climbingSurfaces", tileset);
        groundLayer.setPosition(0,-1*(groundLayer.height - totalHeight));
        groundLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(groundLayer);
        this.matter.world.createDebugGraphic();
    }

    createTrees = (totalWidth, totalHeight) => {

    }
}
