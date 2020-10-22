import Phaser from 'phaser';
import MountainScene from './MountainScene';


type velocity = {
    x: number,
    y: number
}

export default (scene: MountainScene) => {
    //console.log(scene.playerWallJumping);
    const prevVelocity = scene.player.body.velocity;

    if(scene.playerCanJump){
        //console.log(scene.timer.getTime());
        const timeDiff = scene.time.now - scene.playerLastOnGroundTime;
        //console.log('time since last on ground', timeDiff);
        if(timeDiff > 100){
            scene.playerCanJump = false;
            scene.playerRampSliding = false;
        }
        else{
            groundCharacter(scene, prevVelocity);
        }
    }
    else{
        airborneCharacter(scene, prevVelocity);
    }

    //limit player's max speed to avoid going through collision boxes
    if(scene.playerMaxSpeed < Math.abs(scene.player.body.velocity.x)){
        const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
        scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody,
            factor*scene.playerMaxSpeed, 
            scene.player.body.velocity.y);
    }
    if(scene.playerMaxSpeed < Math.abs(scene.player.body.velocity.y)){
        scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody,
            scene.player.body.velocity.x,
            scene.player.body.velocity.y > 0 ? scene.playerMaxSpeed : -1 * scene.playerMaxSpeed);
    }
    // console.log(scene.player.body.velocity);
    // console.log(scene.currentPlayerAnimation);
    // console.log('player wall jumping: ', scene.playerWallJumping);
    // console.log('current player direction:', scene.currentPlayerDirection);
}

const groundCharacter = (scene: MountainScene, prevVelocity: velocity) => {

    // set the animation
    if (scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime)
    {
        setNewCharacterAnimation(scene, 'jump', scene.currentPlayerDirection==='left', false);   
        scene.playerCanJump = false;
        scene.playerFlatSliding = false;
        scene.playerRampSliding = false;
        scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;
        //console.log('jump time:', this.prevJumpTime);
    }  
    else if(scene.playerRampSliding){
        if(scene.currentPlayerAnimation!=='groundSlide'){
            scene.playerFriction = 0;
            setNewCharacterAnimation(scene, 'groundSlide', scene.playerGroundSlideDirection==='left', false); 
            scene.player.setAngle(scene.playerGroundSlideDirection==='left' ? -45 : 45);
        }  
    }
    else if(scene.playerFlatSliding){
        
        if(scene.controlConfig.leftControl.isUp && scene.controlConfig.rightControl.isUp){
            scene.playerFriction = 0;
            setNewCharacterAnimation(scene, 'groundSlide', scene.currentPlayerDirection==='left', false); 
        }
        else{
            scene.playerFlatSliding = false;
        }

    }    
    else if (scene.controlConfig.leftControl.isDown)
    {
        if(!(scene.currentPlayerAnimation==='run' && scene.currentPlayerDirection==='left')){
            setNewCharacterAnimation(scene, 'run', true, false);
        }
    }
    else if (scene.controlConfig.rightControl.isDown)
    {
        if(!(scene.currentPlayerAnimation==='run' && scene.currentPlayerDirection==='right')){
            setNewCharacterAnimation(scene, 'run', false, false);        
        }
    }
    else
    {
        if(scene.currentPlayerAnimation!=='idle1'){
            setNewCharacterAnimation(scene, 'idle1', scene.currentPlayerDirection==='left', false);
        }
    }

    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'idle': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
            break;
        }
        case 'run': {
            if(scene.currentPlayerDirection==='right'){
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.currentPlayerDirection==='left'){
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                break;
            }
            else{
                console.log("don't understand previous character direction");
                break;
            }
        }
        case 'jump': {
            
            if(scene.prevPlayerAnimation==='idle1'){
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, prevVelocity.x, -1*scene.playerJumpHeight);
            }
            else{
                const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*scene.playerSpeed, -1*scene.playerJumpHeight);
                break;
            }
            break;
        } 
        case 'groundSlide': {
            const factor = scene.playerGroundSlideDirection==='left' ? -1 : 1;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor * Math.abs(prevVelocity.x), prevVelocity.y)
            break;
        }
        default: break;
    }
}

const airborneCharacter = (scene: MountainScene, prevVelocity: velocity) => {
    if(scene.playerWallJumping){
        const tolerance = 50;

        const prevX = scene.wallJumpOffPosition.x;
        const prevY = scene.wallJumpOffPosition.y;
       // const currX = scene.playerBody.position.x;
        const currX = scene.player.x
       // const currY = scene.playerBody.position.y;
       const currY = scene.player.y

        //console.log('prevX:', prevX, 'prevY:', prevY, 'currX:', currX, 'currY:', currY);

        //const distance = Math.sqrt(Math.pow(currX-prevX, 2) + Math.pow(currY-prevY, 2));
        const distance = Math.abs(currX-prevX);

        if(distance > tolerance){
            scene.playerWallJumping = false;
        }
    }
    else if(scene.playerWallSliding){
        //start wallsliding
        if(scene.currentPlayerAnimation!=='wallSlide' || scene.resetWallSlide){
            //scene.playerFriction = 0.2;
            setNewCharacterAnimation(scene, 'wallSlide', scene.currentPlayerDirection==='left', false);
        }
        //jump off the wall
        if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
            //console.log('jump off wall');
            //flip the players direction cause they were facing the opposite way when on the wall
            scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
            setNewCharacterAnimation(scene, 'jump', scene.currentPlayerDirection==='left', false);

            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            const jumpX = factor*scene.playerSpeed;
            const jumpY = scene.playerIceWallSliding ? -0.5*scene.playerSpeed : -2.5*scene.playerSpeed;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, jumpX, jumpY);  
            
            scene.playerCanJump = false;        
            scene.playerWallSliding = false;
            scene.playerIceWallSliding = false;   
            scene.playerWallJumping = true;  
            // scene.wallJumpOffPosition = {...scene.playerBody.position};
            scene.wallJumpOffPosition = {x: scene.player.x, y: scene.player.y};  
            scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;
            //console.log('jujst set player wall jump position as:', this.wallJumpOffPosition);
        }
        else{//check if we should stop wall sliding
            if(scene.controlConfig.rightControl.isDown  && scene.controlConfig.leftControl.isUp && scene.currentPlayerDirection!=='right' ||
                scene.controlConfig.leftControl.isDown  && scene.controlConfig.rightControl.isUp && scene.currentPlayerDirection!=='left' ||
               !scene.controlConfig.rightControl.isDown && !scene.controlConfig.leftControl.isDown){
                   //console.log('stopping wall slide');
                   scene.playerFriction = 0;
                   //flip the players direction cause they were facing the opposite way when on the wall
                   scene.stopWallSlidingDirection = scene.currentPlayerDirection;
                   scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
                   setNewCharacterAnimation(scene, 'fall', scene.currentPlayerDirection==='left', false);
                   scene.playerWallSliding = false;
                   //scene.stopWallSlidingPosition = {...scene.playerBody.position}
                   scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y}; 
                  //console.log('set stop wall sliding position to:', this.stopWallSlidingPosition);
               }
        }

    }
    else if(!scene.playerWallJumping){
        if(prevVelocity.y >= 0){
            if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
                if(scene.player.x===scene.stopWallSlidingPosition.x){
                    //scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
                    setNewCharacterAnimation(scene, 'jump', scene.currentPlayerDirection==='left', false); 
                    
                    const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                    //scene.player.setPosition(scene.player.body.position.x + (-1*factor*100), scene.player.body.position.y);

                    const jumpX = factor*scene.playerSpeed;
                    const jumpY = scene.playerIceWallSliding ? -0.5*scene.playerSpeed : -2.5*scene.playerSpeed;
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, jumpX, jumpY);  

                    // scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 
                    //     factor*scene.playerSpeed, 
                    //     -2.5*scene.playerSpeed);  
                    //console.log('set player velocity to:', {x:factor*scene.playerSpeed, y:-2.5*scene.playerSpeed });
                    //console.log('current player Animation:', scene.currentPlayerAnimation);
                    //console.log('after setting new velocity, players body velocity is', scene.player.body.velocity);
                    scene.playerCanJump = false;        
                    scene.playerWallSliding = false;   
                    scene.playerWallJumping = true;  
                    // scene.wallJumpOffPosition = {...scene.playerBody.position};
                    scene.wallJumpOffPosition = {x: scene.player.x, y: scene.player.y};  
                    scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;
                }                
            }
            else if (scene.controlConfig.leftControl.isDown)
            {
                //console.log('checking if player can start wall sliding again at position:', this.playerBody.position);
                //if(scene.playerBody.position.x===scene.stopWallSlidingPosition.x &&
                if(scene.player.x===scene.stopWallSlidingPosition.x &&
                    scene.stopWallSlidingDirection==='left'){
                        //console.log('resetting wall slide to left wall');
                        scene.playerWallSliding = true;
                }
                else if(!(scene.currentPlayerAnimation==='fall' && scene.currentPlayerDirection==='left')){
                    setNewCharacterAnimation(scene, 'fall', true, false);
                }
            }
            else if (scene.controlConfig.rightControl.isDown)
            {
                //console.log('checking if player can start wall sliding again at position:', this.playerBody.position);
                if(scene.player.x===scene.stopWallSlidingPosition.x &&
                    scene.stopWallSlidingDirection==='right'){
                        //console.log('resetting wall slide to right wall');
                        scene.playerWallSliding = true;
                 }
                else if(!(scene.currentPlayerAnimation==='fall' && scene.currentPlayerDirection==='right')){
                    setNewCharacterAnimation(scene, 'fall', false, false);        
                }
            }
            else{
                setNewCharacterAnimation(scene, 'fall', scene.currentPlayerDirection==='left', false);
            }
        }
        else{// player is still moving up
            if (scene.controlConfig.rightControl.isDown)
            {
                if(!(scene.currentPlayerAnimation==='jump' && scene.currentPlayerDirection==='right')){
                    //console.log('still moving up and trying to set to jump right animation');
                    setNewCharacterAnimation(scene, 'jump', false, false);        
                }
            }       
            else if (scene.controlConfig.leftControl.isDown)
            {
                if(!(scene.currentPlayerAnimation==='jump' && scene.currentPlayerDirection==='left')){
                    //console.log('still moving up and trying to set to jump left animation');
                    setNewCharacterAnimation(scene, 'jump', true, false);
                }
            }    
        }
    }



    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'wallSlide': {
            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*0.5, prevVelocity.y);
            break;
        }
        case 'fall': {
            if(scene.currentPlayerDirection==='right' && scene.controlConfig.rightControl.isDown){
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.currentPlayerDirection==='left' && scene.controlConfig.leftControl.isDown){
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                break;
            }
            else{
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
                break;
            }
        }
        case 'jump': {
            if(scene.controlConfig.rightControl.isDown && !scene.playerWallJumping){
                scene.currentPlayerDirection = 'right';
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.controlConfig.leftControl.isDown && !scene.playerWallJumping){
                scene.currentPlayerDirection = 'left';
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.playerWallJumping){
                const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                //scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*scene.playerSpeed, -2.5*scene.playerSpeed); 
            }
        }
        default: break;
    }
}

const setNewCharacterAnimation = (scene: MountainScene, animationName, flipX, flipY) => {
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

    scene.playerBody = scene.matter.add.fromPhysicsEditor(scene.player.x, scene.player.y, bodyData, undefined, false);
    scene.playerBody.friction = scene.playerFriction;
    //scene.playerBody.frictionAir = 0.01;
    //scene.playerBody.friction = 1;
    scene.player.setExistingBody(scene.playerBody);

    scene.player.setScale((flipX ? -1 : 1)*scene.playerScaleFactor, 
                          (flipY ? -1 : 1)*scene.playerScaleFactor);

    scene.player.play(animationName, true);
    scene.prevPlayerAnimation = scene.currentPlayerAnimation;
    scene.currentPlayerAnimation = animationName;

    scene.prevPlayerDirection = scene.currentPlayerDirection;
    scene.currentPlayerDirection = flipX ? 'left' : 'right';

    scene.player.setBounce(0);
    scene.player.setFixedRotation();  

    scene.audio.playAnimationSound(animationName);
}