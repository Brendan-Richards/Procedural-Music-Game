import { Identity } from '@tensorflow/tfjs-core';
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
}

const groundCharacter = (scene: MountainScene, prevVelocity: velocity) => {
    // set the animation
    if(scene.drawSword || scene.sheathSword){
        if(scene.drawSword && scene.currentPlayerAnimation !== 'draw' && scene.currentPlayerAnimation !== 'drawAir'){
            setNewCharacterAnimation(scene, 'draw', scene.currentPlayerDirection==='left', false);
        }
        else if(scene.sheathSword && scene.currentPlayerAnimation !== 'sheath' && scene.currentPlayerAnimation !== 'sheathAir'){
            setNewCharacterAnimation(scene, 'sheath', scene.currentPlayerDirection==='left', false);
        }
    }
    else if(scene.playerAttacking){
        if((scene.currentPlayerAnimation !== 'attack1' && scene.currentPlayerAnimation !== 'attack2' && scene.currentPlayerAnimation !== 'attack3')
             && scene.time.now - scene.lastAttackTime > 500){
            console.log('setting animation to attack');
            const attackNum = Math.floor(Math.random() * 3) + 1; 
            setNewCharacterAnimation(scene, 'attack' + attackNum.toString(), scene.currentPlayerDirection==='left', false);
            scene.lastAttackTime = scene.time.now; 
           // scene.stamina -= scene.attackStaminaPenalty;
        }
    }
    else if (scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime)
    {
        const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
        setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);   
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
        if(!((scene.currentPlayerAnimation==='run' || scene.currentPlayerAnimation==='runSword')  && scene.currentPlayerDirection==='left')){
            setNewCharacterAnimation(scene, scene.swordDrawn ? 'runSword' : 'run', true, false);
        }
    }
    else if (scene.controlConfig.rightControl.isDown)
    {
        if(!((scene.currentPlayerAnimation==='run' || scene.currentPlayerAnimation==='runSword')  && scene.currentPlayerDirection==='right')){
            setNewCharacterAnimation(scene, scene.swordDrawn ? 'runSword' : 'run', false, false);        
        }
    }
    else
    {
        if(scene.currentPlayerAnimation!=='idle1' && scene.currentPlayerAnimation!=='idleSword'){
            setNewCharacterAnimation(scene, scene.swordDrawn ? 'idleSword' : 'idle1', scene.currentPlayerDirection==='left', false);
        }
    }

    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'attack1':
        case 'attack2':
        case 'attack3': 
        case 'idleSword':
        case 'idle': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
            break;
        }
        case 'runSword':
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
        case 'jumpSword':
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
        const tolerance = 60;

        const prevX = scene.wallJumpOffPosition.x;
        //const prevY = scene.wallJumpOffPosition.y;

        const currX = scene.player.x
       //const currY = scene.player.y

        const distance = Math.abs(currX-prevX);

        if(distance > tolerance){
            scene.playerWallJumping = false;
           
        }
    }
    else if(scene.drawSword || scene.sheathSword){
        if(scene.drawSword && scene.currentPlayerAnimation !== 'drawAir'){
            setNewCharacterAnimation(scene, 'drawAir', scene.currentPlayerDirection==='left', false);
        }
        else if(scene.sheathSword && scene.currentPlayerAnimation !== 'sheathAir'){
            setNewCharacterAnimation(scene, 'sheathAir', scene.currentPlayerDirection==='left', false);
        }
    }
    else if(scene.playerAttacking){
        if(scene.downAttack){
            if(scene.currentPlayerAnimation !== 'airAttack3Start' && scene.currentPlayerAnimation !== 'airAttack3Loop' && scene.currentPlayerAnimation !== 'airAttack3End'){
                console.log('setting animation to downward airAttack');
                setNewCharacterAnimation(scene, 'airAttack3Start', scene.currentPlayerDirection==='left', false);
                //scene.stamina -= scene.attackStaminaPenalty;
            }
        }
        else if(scene.playerWallSliding){
            if(scene.currentPlayerAnimation !== 'wallAttack' && scene.stamina > 0){
                scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y};
                setNewCharacterAnimation(scene, 'wallAttack', scene.currentPlayerDirection==='left', false);
                scene.stamina -= scene.attackStaminaPenalty;
                scene.lastAttackTime = scene.time.now;
            }
            if(scene.stamina <= 0){
                scene.playerAttacking = false;
            }
        }
        else if((scene.currentPlayerAnimation !== 'airAttack1' && scene.currentPlayerAnimation !== 'airAttack2')
             && scene.time.now - scene.lastAttackTime > 500){
            console.log('setting animation to airAttack');
            const attackNum = Math.floor(Math.random() * 2) + 1; 
            setNewCharacterAnimation(scene, 'airAttack' + attackNum.toString(), scene.currentPlayerDirection==='left', false);
            scene.lastAttackTime = scene.time.now; 
            //scene.stamina -= scene.attackStaminaPenalty;
        }
    }
    else if(scene.playerWallSliding){
        //start wallsliding
        if((scene.currentPlayerAnimation!=='wallSlide' && scene.currentPlayerAnimation!=='wallSlideSword') || scene.resetWallSlide){
            //scene.playerFriction = 0.2;
            const animationName = scene.swordDrawn ? 'wallSlideSword' : 'wallSlide';
            setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
        }
        //jump off the wall
        if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime && scene.stamina > 0){
            //console.log('jump off wall');
            //flip the players direction cause they were facing the opposite way when on the wall
            scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
            const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
            scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y};
            setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
            //console.log('player direction at tiem of wall jump:', scene.currentPlayerDirection);

            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            const jumpX = factor*scene.playerSpeed;
            const jumpY = scene.playerIceWallSliding ? scene.playerIceJumpHeight : scene.playerWallJumpHeight;
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
                   console.log('checking if player can start wall sliding again at position:');
                   scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y}; 
                   const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
                   setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
                   scene.playerWallSliding = false;
                   scene.playerIceWallSliding = false;
                   //scene.stopWallSlidingPosition = {...scene.playerBody.position}
                   
                  //console.log('set stop wall sliding position to:', this.stopWallSlidingPosition);
               }
        }

    }
    else if(scene.playerLedgeGrab || scene.playerLedgeClimb){
        //scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
        if(scene.stamina===0){
            scene.player.setIgnoreGravity(false);
            scene.player.setPosition(scene.player.body.position.x-5, scene.player.body.position.y);
            const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
            setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
            scene.playerLedgeGrab = false;
            scene.playerLedgeClimb = false;
        }
        else if(scene.currentPlayerAnimation!=='ledgeGrab' && scene.currentPlayerAnimation!=='ledgeGrabSword' && scene.playerLedgeGrab){
            const animationName = scene.swordDrawn ? 'ledgeGrabSword' : 'ledgeGrab';
            setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
            scene.player.setIgnoreGravity(true);
        }
        else if(scene.currentPlayerAnimation!=='jump' && scene.currentPlayerAnimation!=='jumpSword' && scene.controlConfig.jumpControl.isDown && scene.stamina > 0){
            //console.log('setting to ledge climb');
            scene.playerLedgeGrab = false;
            scene.playerLedgeClimb = true;

            const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
            setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
            scene.player.once('animationcomplete', (animation, frame) => {
                if(animation.key==='jump' || animation.key==='jumpSword'){
                    scene.playerLedgeClimb = false;
                }
            }, scene);
            //setNewCharacterAnimation(scene, 'ledgeClimb', scene.currentPlayerDirection==='left', false);
            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, -1 * scene.playerJumpHeight);
            const tween = scene.tweens.add({
                targets: scene.player,
                onComplete: () => {
                    console.log('tween finished, in callback');
                    scene.playerLedgeClimb = false;
                },
                onCompleteScope: scene,
                duration: 290,
                //y: scene.player.body.position.y-43,
                //y: scene.player.body.position.y - 130,
                x: scene.player.body.position.x+(factor * 90)
            });


            if(scene.currentPlayerDirection==='right'){
                scene.input.keyboard.once('keydown-LEFT', () => {
                    if(tween.isPlaying()){
                        tween.stop();
                        const velY = scene.player.body.velocity.y;
                        setNewCharacterAnimation(scene, animationName, true, false);
                        scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, velY); 
                        prevVelocity.y = -1 * scene.playerJumpHeight;
                    }
                    scene.playerLedgeClimb = false;
                });
                if(scene.controlConfig.leftControl.isDown){
                    tween.stop();
                    setNewCharacterAnimation(scene, animationName, true, false);
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, scene.player.body.velocity.y); 
                    prevVelocity.y = -1 * scene.playerJumpHeight;
                    scene.playerLedgeClimb = false;
                }
            }
            else if(scene.currentPlayerDirection==='left'){
                scene.input.keyboard.once('keydown-RIGHT', () => {
                    if(tween.isPlaying()){
                        tween.stop();
                        const velY = scene.player.body.velocity.y;
                        setNewCharacterAnimation(scene, animationName, false, false);
                        scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, velY); 
                        prevVelocity.y = -1 * scene.playerJumpHeight;
                    }
                    scene.playerLedgeClimb = false;
                });
                if(scene.controlConfig.rightControl.isDown){
                    tween.stop();
                    setNewCharacterAnimation(scene, animationName, false, false);
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, scene.player.body.velocity.y); 
                    prevVelocity.y = -1 * scene.playerJumpHeight;
                    scene.playerLedgeClimb = false;
                }
            }

            //scene.player.setVelocity(0, -1*scene.playerJumpHeight*0.8);
            //scene.player.setIgnoreGravity(true);
        }        
    }
    else if(!scene.playerWallJumping){
        if(prevVelocity.y >= 0){
            if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
                if(scene.player.x===scene.stopWallSlidingPosition.x && scene.stamina > 0){
                    //scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
                    setNewCharacterAnimation(scene, 'jump', scene.currentPlayerDirection==='left', false); 
                    
                    const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                    //scene.player.setPosition(scene.player.body.position.x + (-1*factor*100), scene.player.body.position.y);

                    const jumpX = factor*scene.playerSpeed;
                    const jumpY = scene.playerIceWallSliding ? scene.playerIceJumpHeight : scene.playerWallJumpHeight;
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, jumpX, jumpY); 

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
                else if(!((scene.currentPlayerAnimation==='fall' || scene.currentPlayerAnimation==='fallSword') && scene.currentPlayerDirection==='left')){
                    const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
                    scene.playerFriction = 0;
                    setNewCharacterAnimation(scene, animationName, true, false);
                }
            }
            else if (scene.controlConfig.rightControl.isDown)
            {
                //console.log('checking if player can start wall sliding again at position:');
                if(scene.player.x===scene.stopWallSlidingPosition.x &&
                    scene.stopWallSlidingDirection==='right'){
                        //console.log('resetting wall slide to right wall');
                        scene.playerWallSliding = true;
                 }
                else if(!((scene.currentPlayerAnimation==='fall' || scene.currentPlayerAnimation==='fallSword') && scene.currentPlayerDirection==='right')){
                    const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
                    scene.playerFriction = 0;
                    setNewCharacterAnimation(scene, animationName, false, false);        
                }
            }
            else{
                const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
                scene.playerFriction = 0;
                setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
            }
        }
        else{// player is still moving up

            if (scene.controlConfig.rightControl.isDown)
            {
                if(!(scene.currentPlayerAnimation==='jump' && scene.currentPlayerDirection==='right')){
                    //console.log('still moving up and trying to set to jump right animation');
                    const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
                    setNewCharacterAnimation(scene, animationName, false, false);        
                }
            }       
            else if (scene.controlConfig.leftControl.isDown)
            {
                if(!(scene.currentPlayerAnimation==='jump' && scene.currentPlayerDirection==='left')){
                    //console.log('still moving up and trying to set to jump left animation');
                    const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
                    setNewCharacterAnimation(scene, animationName, true, false);
                }
            }    
        }
    }



    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'wallSlideSword':
        case 'wallAttack':
        case 'wallSlide': {
            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*0.5, prevVelocity.y);
            break;
        }
        case 'ledgeGrab':
        case 'ledgeGrabSword': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
            break;
        }
        case 'airAttack3Start':
        case 'airAttack3Loop': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, scene.playerMaxSpeed);
            break;
        }
        case 'fallSword': {
                if(scene.currentPlayerDirection==='right' && scene.controlConfig.rightControl.isDown){
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                }
                else if(scene.currentPlayerDirection==='left' && scene.controlConfig.leftControl.isDown){
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                }
                else{
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
                }
            break;
        }
        case 'airAttack1':
        case 'airAttack2':
        case 'drawAir':
        case 'sheathAir':
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
        case 'jumpSword':
        case 'jump': {
            if(scene.playerLedgeClimb){

            }
            else{
                if(scene.controlConfig.rightControl.isDown && !scene.playerWallJumping){
                    //scene.currentPlayerDirection = 'right';
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                    break;
                }
                else if(scene.controlConfig.leftControl.isDown && !scene.playerWallJumping){
                    //scene.currentPlayerDirection = 'left';
                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                    break;
                }
                else if(scene.playerWallJumping){
                    const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                    //scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*scene.playerSpeed, -2.5*scene.playerSpeed); 
                }
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
        case 'idleSword': {bodyData = scene.characterShapes.adventurer_idle_2_00; break;}
        case 'run': {bodyData = scene.characterShapes.adventurer_run_00; break;}
        case 'runSword': {bodyData = scene.characterShapes.adventurer_run3_00; break;}
        case 'jump': {bodyData = scene.characterShapes.adventurer_jump_up_00; break;}
        case 'jumpSword': {bodyData = scene.characterShapes.adventurer_jump_up_swrd_00; break;}
        case 'fall': {bodyData = scene.characterShapes.adventurer_fall_00; break;}
        case 'fallSword': {bodyData = scene.characterShapes.adventurer_swrd_fall_00; break;}
        case 'smrslt': {bodyData = scene.characterShapes.adventurer_smrslt_00; break;}
        case 'wallSlide': {bodyData = scene.characterShapes.adventurer_wall_slide_00; break;}
        case 'wallAttack': {bodyData = scene.characterShapes.adventurer_wall_attack_01; break;}
        case 'wallSlideSword': {bodyData = scene.characterShapes.adventurer_wall_slide_swrd_00; break;}
        case 'groundSlide': {bodyData = scene.characterShapes.adventurer_slide_00; break;}
        case 'ledgeGrab': {bodyData = scene.characterShapes.adventurer_crnr_grb_00; break;}
        case 'ledgeGrabSword': {bodyData = scene.characterShapes.adventurer_crnr_grb_swrd_00; break;}
        case 'ledgeClimb': {bodyData = scene.characterShapes.adventurer_crnr_clmb_00; break;}
        case 'attack1': {bodyData = scene.characterShapes.adventurer_attack1_00; break;}
        case 'attack2': {bodyData = scene.characterShapes.adventurer_attack2_00; break;}
        case 'attack3': {bodyData = scene.characterShapes.adventurer_attack3_00; break;}
        case 'draw': {bodyData = scene.characterShapes.adventurer_swrd_drw_00; break;}
        case 'sheath': {bodyData = scene.characterShapes.adventurer_swrd_shte_00; break;}
        case 'drawAir': {bodyData = scene.characterShapes.adventurer_swrd_drw_air_00; break;}
        case 'sheathAir': {bodyData = scene.characterShapes.adventurer_swrd_shte_air_00; break;}
        case 'airAttack1': {bodyData = scene.characterShapes.adventurer_air_attack1_00; break;}
        case 'airAttack2': {bodyData = scene.characterShapes.adventurer_air_attack2_00; break;}
        case 'airAttack3Start': {bodyData = scene.characterShapes.adventurer_air_attack3_rdy_00; break;}
        default: break;
    }

    scene.playerBody = scene.matter.add.fromPhysicsEditor(scene.player.x, scene.player.y, bodyData, undefined, false);
    scene.playerBody.friction = scene.playerFriction;

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
}