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
        if(scene.drawSword && !scene.swordDraws.includes(scene.currentPlayerAnimation)){
            let animation = '';
            switch(scene.currentPlayerAnimation){
                case 'idleSword': {animation = 'idleSwordDraw'; break;}
                case 'runSword': {animation = 'runSwordDraw'; break;}
            }
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
        }
        else if(scene.sheathSword && !scene.swordSheaths.includes(scene.currentPlayerAnimation)){
            let animation = '';
            switch(scene.currentPlayerAnimation){
                case 'idleSwordDrawn': {animation = 'idleSwordSheath'; break;}
                case 'runSwordDrawn': {animation = 'runSwordSheath'; break;}
            } 
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
        }
        else if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
            //const currentFrameIdx = scene.player.anims.currentFrame.index;
            setNewCharacterAnimation(scene, scene.currentPlayerAnimation, true, false);
        }
        else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
            //const currentFrameIdx = scene.player.anims.currentFrame.index;
            setNewCharacterAnimation(scene, scene.currentPlayerAnimation, false, false);
        }
    }
    else if(scene.playerAttacking){
        if(scene.equippedWeapon==='sword'){
            if(!scene.swordAttacks.includes(scene.currentPlayerAnimation) && scene.time.now - scene.lastAttackTime > 500){
                let swing = '';
                switch(scene.prevSwordSwing){
                    case 'idleSwing1': {swing = 'idleSwing2'; scene.prevSwordSwing = 'idleSwing2'; break;}
                    case 'idleSwing2': {swing = 'runSwing'; scene.prevSwordSwing = 'runSwing'; break;}
                    default: {swing = 'idleSwing1'; scene.prevSwordSwing = 'idleSwing1'; break;}
                }
                setNewCharacterAnimation(scene, swing, scene.currentPlayerDirection==='left', false);
    
               // scene.stamina -= scene.attackStaminaPenalty;
            }
        }
        else if(scene.equippedWeapon==='none'){
            if(scene.playerKick && scene.currentPlayerAnimation!=='groundKick'){
                setNewCharacterAnimation(scene, 'groundKick', scene.currentPlayerDirection==='left', false);
            }
            else if(!scene.meeleeAttacks.includes(scene.currentPlayerAnimation) && scene.time.now - scene.lastAttackTime > 500){
                let attack = '';
                switch(scene.prevMeeleeAttack){
                    case 'punch1': {attack = 'punch2'; scene.prevMeeleeAttack = 'punch2'; break;}
                    case 'punch2': {attack = 'punch3'; scene.prevMeeleeAttack = 'punch3'; break;}
                    case 'punch3': {attack = 'runPunch'; scene.prevMeeleeAttack = 'runPunch'; break;}
                    //case 'runPunch': {attack = 'groundKick'; scene.prevMeeleeAttack = 'groundKick'; break;}
                    default: {attack = 'punch1'; scene.prevMeeleeAttack = 'punch1'; break;}
                }
                setNewCharacterAnimation(scene, attack, scene.currentPlayerDirection==='left', false);
    
               // scene.stamina -= scene.attackStaminaPenalty;
            }            
        }

    }
    else if (scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime)
    {
        let animationName = '';
        switch(scene.equippedWeapon){
            case 'none': {animationName = 'jump'; break;}
            case 'sword': {animationName = scene.swordDrawn ? 'jumpSwordDrawn' : 'jumpSword'; break;}
        }
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
        if(!((scene.currentPlayerAnimation==='run' || scene.currentPlayerAnimation==='runSword' || scene.currentPlayerAnimation==='runSwordDrawn')  && scene.currentPlayerDirection==='left')){
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'run'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'runSwordDrawn' : 'runSword'}
            }
            setNewCharacterAnimation(scene, animation, true, false);
        }
    }
    else if (scene.controlConfig.rightControl.isDown)
    {
        if(!((scene.currentPlayerAnimation==='run' || scene.currentPlayerAnimation==='runSword' || scene.currentPlayerAnimation==='runSwordDrawn')  && scene.currentPlayerDirection==='right')){
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'run'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'runSwordDrawn' : 'runSword'; break;}
            }
            setNewCharacterAnimation(scene, animation, false, false);        
        }
    }
    else
    {
        if(scene.currentPlayerAnimation!=='idle' && scene.currentPlayerAnimation!=='idleSword' && scene.currentPlayerAnimation!=='idleSwordDrawn' && scene.currentPlayerAnimation!=='idleSword'){
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'idle'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'idleSwordDrawn' : 'idleSword'; break;}
            }
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
        }
    }

    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'idleSwing1':
        case 'idleSwing2':
        case 'idleSword':
        case 'idleSwordDrawn':
        case 'idle': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
            break;
        }
        case 'runSword':
        case 'runSwordDrawn':
        case 'runSwordDraw':
        case 'runSwordSheath':
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
        case 'jumpSwordDrawn':
        case 'jump': {
            if(scene.prevPlayerAnimation==='idle' || scene.prevPlayerAnimation==='idleSword' || scene.prevPlayerAnimation==='idleSwordDrawn'){
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, prevVelocity.x, -1*scene.playerJumpHeight);
            }
            else{
                const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*scene.playerSpeed, -1*scene.playerJumpHeight);
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
        // if(scene.drawSword && scene.currentPlayerAnimation !== 'drawAir'){
        //     setNewCharacterAnimation(scene, 'drawAir', scene.currentPlayerDirection==='left', false);
        // }
        // else if(scene.sheathSword && scene.currentPlayerAnimation !== 'sheathAir'){
        //     setNewCharacterAnimation(scene, 'sheathAir', scene.currentPlayerDirection==='left', false);
        // }
        //console.log('trying to draw or sheath sword, current player animation:', scene.currentPlayerAnimation);
        if(scene.drawSword && !scene.swordDraws.includes(scene.currentPlayerAnimation)){
            let animation = '';
            switch(scene.currentPlayerAnimation){
                case 'jumpSword': {animation = 'jumpSwordDraw'; break;}
                case 'wallSlideSword': {animation = 'wallSwordDraw'; break;}
                case 'ledgeGrabSword': {animation = 'ledgeSwordDraw'; break;}
                case 'fallSword': {animation = 'fallSwordDraw'; break;}
            }
            //console.log('changing animation to some draw');
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
        }
        else if(scene.sheathSword && !scene.swordSheaths.includes(scene.currentPlayerAnimation)){
            let animation = '';
            switch(scene.currentPlayerAnimation){
                case 'jumpSwordDrawn': {animation = 'jumpSwordSheath'; break;}
                case 'wallSlideSwordDrawn': {animation = 'wallSwordSheath'; break;}
                case 'ledgeGrabSwordDrawn': {animation = 'ledgeSwordSheath'; break;}
                case 'fallSwordDrawn': {animation = 'fallSwordSheath'; break;}
            } 
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
        }
        else if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
            //const currentFrameIdx = scene.player.anims.currentFrame.index;
            setNewCharacterAnimation(scene, scene.currentPlayerAnimation, true, false);
        }
        else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
            //const currentFrameIdx = scene.player.anims.currentFrame.index;
            setNewCharacterAnimation(scene, scene.currentPlayerAnimation, false, false);
        }
    }
    else if(scene.playerAttacking){
        //console.log('player is attacking');
        if(scene.equippedWeapon==='sword'){
            if(scene.downAttack){
                if(scene.currentPlayerAnimation !== 'airSwing3Start' && scene.currentPlayerAnimation !== 'airSwing3Loop' && scene.currentPlayerAnimation !== 'airSwing3End'){
                    //console.log('setting animation to downward airAttack');
                    setNewCharacterAnimation(scene, 'airSwing3Start', scene.currentPlayerDirection==='left', false);
                    //scene.stamina -= scene.attackStaminaPenalty;
                }
            }
            else if(scene.playerWallSliding){
                if(scene.currentPlayerAnimation !== 'wallSwing' && scene.stamina > 0){
                    scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y};
                    setNewCharacterAnimation(scene, 'wallSwing', scene.currentPlayerDirection==='left', false);
                    scene.stamina -= scene.attackStaminaPenalty;
                    scene.lastAttackTime = scene.time.now;
                }
                if(scene.stamina <= 0){
                    scene.playerAttacking = false;
                }
            }
            else if((scene.currentPlayerAnimation !== 'airSwing1' && scene.currentPlayerAnimation !== 'airSwing2') && scene.time.now - scene.lastAttackTime > 500){
                //console.log('setting animation to airSwing');
                let swing = '';
                switch(scene.prevSwordSwing){
                    case 'airSwing2': {swing = 'airSwing1'; scene.prevSwordSwing = 'airSwing1'; break;}
                    case 'airSwing1': 
                    default: {swing = 'airSwing2'; scene.prevSwordSwing = 'airSwing2'; break;}
                }   
                setNewCharacterAnimation(scene, swing, scene.currentPlayerDirection==='left', false);
                scene.lastAttackTime = scene.time.now; 
                //scene.stamina -= scene.attackStaminaPenalty;
            }
        }
        else if(scene.equippedWeapon==='none'){
            if(scene.currentPlayerAnimation!=='airKick' && scene.time.now - scene.lastAttackTime > 500){
                setNewCharacterAnimation(scene, 'airKick', scene.currentPlayerDirection==='left', false);
            }            
        }

    }
    else if(scene.playerWallSliding){
        //start wallsliding
        if((scene.currentPlayerAnimation!=='wallSlide' && scene.currentPlayerAnimation!=='wallSlideSword' && scene.currentPlayerAnimation!=='wallSlideSwordDrawn') || scene.resetWallSlide){
            //scene.playerFriction = 0.2;
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'wallSlide'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'wallSlideSwordDrawn' : 'wallSlideSword'; break;}
            }
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
        }
        //jump off the wall
        if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime && scene.stamina > 0){
            //console.log('jump off wall');
            //flip the players direction cause they were facing the opposite way when on the wall
            scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
            //const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'jump'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'jumpSwordDrawn' : 'jumpSword'; break;}
            }
            scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y};
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
            //console.log('player direction at tiem of wall jump:', scene.currentPlayerDirection);

            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            const jumpX = factor*scene.playerSpeed;
            const jumpY = scene.playerIceWallSliding ? scene.playerIceJumpHeight : scene.playerWallJumpHeight;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, jumpX, jumpY);  
            console.log('player velocity:', jumpX, jumpY);
            
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
                   //const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
                   let animation = '';
                   switch(scene.equippedWeapon){
                       case 'none': {animation = 'fall'; break;}
                       case 'sword': {animation = scene.swordDrawn ? 'fallSwordDrawn' : 'fallSword'; break;}
                   }
                   setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
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
            //const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'fall'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'fallSwordDrawn' : 'fallSword'; break;}
            }
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
            scene.playerLedgeGrab = false;
            scene.playerLedgeClimb = false;
        }
        else if(scene.currentPlayerAnimation!=='ledgeGrab' && scene.currentPlayerAnimation!=='ledgeGrabSword' && scene.currentPlayerAnimation!=='ledgeGrabSwordDrawn' && scene.playerLedgeGrab){
            //const animationName = scene.swordDrawn ? 'ledgeGrabSword' : 'ledgeGrab';
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'ledgeGrab'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'ledgeGrabSwordDrawn' : 'ledgeGrabSword'; break;}
            }           
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
            scene.player.setIgnoreGravity(true);
        }
        else if(scene.currentPlayerAnimation!=='jump' && scene.currentPlayerAnimation!=='jumpSword' && scene.currentPlayerAnimation!=='jumpSwordDrawn' && scene.controlConfig.jumpControl.isDown && scene.stamina > 0){
            //console.log('setting to ledge climb');
            scene.playerLedgeGrab = false;
            scene.playerLedgeClimb = true;

            const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
            let animation = '';
            switch(scene.equippedWeapon){
                case 'none': {animation = 'jump'; break;}
                case 'sword': {animation = scene.swordDrawn ? 'jumpSwordDrawn' : 'jumpSword'; break;}
            }
            setNewCharacterAnimation(scene, animation, scene.currentPlayerDirection==='left', false);
            scene.player.once('animationcomplete', (animation, frame) => {
                if(animation.key==='jump' || animation.key==='jumpSword' || animation.key==='jumpSwordDrawn'){
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
                        setNewCharacterAnimation(scene, animation, true, false);
                        scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, velY); 
                        prevVelocity.y = -1 * scene.playerJumpHeight;
                    }
                    scene.playerLedgeClimb = false;
                });
                if(scene.controlConfig.leftControl.isDown){
                    tween.stop();
                    setNewCharacterAnimation(scene, animation, true, false);
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
                        setNewCharacterAnimation(scene, animation, false, false);
                        scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, velY); 
                        prevVelocity.y = -1 * scene.playerJumpHeight;
                    }
                    scene.playerLedgeClimb = false;
                });
                if(scene.controlConfig.rightControl.isDown){
                    tween.stop();
                    setNewCharacterAnimation(scene, animation, false, false);
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
                if(scene.player.x===scene.stopWallSlidingPosition.x && scene.stopWallSlidingDirection==='left'){
                        //console.log('resetting wall slide to left wall');
                        scene.playerWallSliding = true;
                }
                else if(!((scene.currentPlayerAnimation==='fall' || scene.currentPlayerAnimation==='fallSword' || scene.currentPlayerAnimation==='fallSwordDrawn') && scene.currentPlayerDirection==='left')){
                    let animationName = '';
                    switch(scene.equippedWeapon){
                        case 'none': {animationName = 'fall'; break;}
                        case 'sword': {animationName = scene.swordDrawn ? 'fallSwordDrawn' : 'fallSword'; break;}
                    }
                    scene.playerFriction = 0;
                    setNewCharacterAnimation(scene, animationName, true, false);
                }
            }
            else if (scene.controlConfig.rightControl.isDown)
            {
                //console.log('checking if player can start wall sliding again at position:');
                if(scene.player.x===scene.stopWallSlidingPosition.x && scene.stopWallSlidingDirection==='right'){
                        //console.log('resetting wall slide to right wall');
                        scene.playerWallSliding = true;
                 }
                else if(!((scene.currentPlayerAnimation==='fall' || scene.currentPlayerAnimation==='fallSword' || scene.currentPlayerAnimation==='fallSwordDrawn') && scene.currentPlayerDirection==='right')){
                    let animationName = '';
                    switch(scene.equippedWeapon){
                        case 'none': {animationName = 'fall'; break;}
                        case 'sword': {animationName = scene.swordDrawn ? 'fallSwordDrawn' : 'fallSword'; break;}
                    }
                    scene.playerFriction = 0;
                    setNewCharacterAnimation(scene, animationName, false, false);        
                }
            }
            else{
                let animationName = '';
                switch(scene.equippedWeapon){
                    case 'none': {animationName = 'fall'; break;}
                    case 'sword': {animationName = scene.swordDrawn ? 'fallSwordDrawn' : 'fallSword'; break;}
                }
                scene.playerFriction = 0;
                setNewCharacterAnimation(scene, animationName, scene.currentPlayerDirection==='left', false);
            }
        }
        else{// player is still moving up

            if (scene.controlConfig.rightControl.isDown)
            {
                if(!((scene.currentPlayerAnimation==='jump' || scene.swordAttacks.includes(scene.currentPlayerAnimation) || scene.currentPlayerAnimation==='jumpSwordSheath'  || scene.currentPlayerAnimation==='jumpSwordDraw' || scene.currentPlayerAnimation==='jumpSword' || scene.currentPlayerAnimation==='jumpSwordDrawn') && scene.currentPlayerDirection==='right')){
                    //console.log('still moving up and trying to set to jump right animation');
                    // let animation = '';
                    // switch(scene.currentPlayerAnimation){
                    //     case 'jumpSwordDrawn': {animation = 'jumpSwordSheath'; break;}
                    //     case 'jumpSword': {animation = 'wallSwordSheath'; break;}
                    //     case 'jump': {animation = 'ledgeSwordSheath'; break;}
                    // } 
                    // const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
                    //console.log('setting animation to:', scene.currentPlayerAnimation);
                    setNewCharacterAnimation(scene, scene.currentPlayerAnimation, false, false);        
                }
            }       
            else if (scene.controlConfig.leftControl.isDown)
            {
                if(!((scene.currentPlayerAnimation==='jump' || scene.swordAttacks.includes(scene.currentPlayerAnimation) || scene.currentPlayerAnimation==='jumpSwordSheath' || scene.currentPlayerAnimation==='jumpSwordDraw' || scene.currentPlayerAnimation==='jumpSword' || scene.currentPlayerAnimation==='jumpSwordDrawn') && scene.currentPlayerDirection==='left')){
                    //console.log('still moving up and trying to set to jump left animation');
                    //const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
                    setNewCharacterAnimation(scene, scene.currentPlayerAnimation, true, false);
                }
            }    
        }
    }



    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'wallSlideSword':
        case 'wallSlideSwordDrawn':
        case 'wallSwing':
        case 'wallSlide': {
            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*0.5, prevVelocity.y);
            break;
        }
        case 'ledgeGrab':
        case 'ledgeGrabSwordDrawn':
        case 'ledgeGrabSword': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
            break;
        }
        case 'airSwing3Start':
        case 'airSwing3Loop': {
            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, scene.playerMaxSpeed);
            break;
        }
        
        // case 'fallSword': {
        //         if(scene.currentPlayerDirection==='right' && scene.controlConfig.rightControl.isDown){
        //             scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
        //         }
        //         else if(scene.currentPlayerDirection==='left' && scene.controlConfig.leftControl.isDown){
        //             scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
        //         }
        //         else{
        //             scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
        //         }
        //     break;
        // }
        case 'airSwing1':
        case 'airSwing2':
        case 'jumpSwordDraw':
        case 'jumpSwordSheath':
        case 'fallSword':
        case 'fallSwordDraw':
        case 'fallSwordSheath':
        case 'fallSwordDrawn':
        case 'airKick':
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
        case 'jumpSwordDrawn':
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

    console.log('animation name:', animationName)

    let bodyData = null;
    switch(animationName){
        case 'idle': {bodyData = scene.characterShapes.adventurer_idle_00; break;}
        case 'run': {bodyData = scene.characterShapes.adventurer_run_00; break;}
        case 'jump': {bodyData = scene.characterShapes.adventurer_jump_00; break;}
        case 'wallSlide': {bodyData = scene.characterShapes.adventurer_wallSlide_00; break;}
        case 'ledgeGrab': {bodyData = scene.characterShapes.adventurer_ledgeGrab_00; break;}
        case 'fall': {bodyData = scene.characterShapes.adventurer_fall_00; break;}
        case 'punch1': {bodyData = scene.characterShapes.adventurer_punch1_00; break;}
        case 'punch2': {bodyData = scene.characterShapes.adventurer_punch2_00; break;}
        case 'punch3': {bodyData = scene.characterShapes.adventurer_punch3_00; break;}
        case 'runPunch': {bodyData = scene.characterShapes.adventurer_runPunch_00; break;}
        case 'groundKick': {bodyData = scene.characterShapes.adventurer_groundKick_00; break;}
        case 'airKick': {bodyData = scene.characterShapes.adventurer_airKick_00; break;}
        case 'idleSword': {bodyData = scene.characterShapes.adventurer_idleSword_00; break;}
        case 'runSword': {bodyData = scene.characterShapes.adventurer_runSword_00; break;}
        case 'jumpSword': {bodyData = scene.characterShapes.adventurer_jumpSword_00; break;}
        case 'wallSlideSword': {bodyData = scene.characterShapes.adventurer_wallSlideSword_00; break;}
        case 'ledgeGrabSword': {bodyData = scene.characterShapes.adventurer_ledgeGrabSword_00; break;}
        case 'fallSword': {bodyData = scene.characterShapes.adventurer_fallSword_00; break;}
        case 'idleSwordDrawn': {bodyData = scene.characterShapes.adventurer_idleSwordDrawn_00; break;}
        case 'runSwordDrawn': {bodyData = scene.characterShapes.adventurer_runSwordDrawn_00; break;}
        case 'jumpSwordDrawn': {bodyData = scene.characterShapes.adventurer_jumpSwordDrawn_00; break;}
        case 'wallSlideSwordDrawn': {bodyData = scene.characterShapes.adventurer_wallSlideSwordDrawn_00; break;}
        case 'ledgeGrabSwordDrawn': {bodyData = scene.characterShapes.adventurer_ledgeGrabSwordDrawn_00; break;}
        case 'fallSwordDrawn': {bodyData = scene.characterShapes.adventurer_fallSwordDrawn_00; break;}
        case 'idleSwordDraw': {bodyData = scene.characterShapes.adventurer_idleSwordDraw_00; break;}
        case 'runSwordDraw': {bodyData = scene.characterShapes.adventurer_runSwordDraw_00; break;}
        case 'jumpSwordDraw': {bodyData = scene.characterShapes.adventurer_jumpSwordDraw_00; break;}
        case 'fallSwordDraw': {bodyData = scene.characterShapes.adventurer_fallSwordDraw_00; break;}
        case 'wallSwordDraw': {bodyData = scene.characterShapes.adventurer_wallSwordDraw_00; break;}
        case 'ledgeSwordDraw': {bodyData = scene.characterShapes.adventurer_ledgeSwordDraw_00; break;}
        case 'idleSwordSheath': {bodyData = scene.characterShapes.adventurer_idleSwordSheath_00; break;}
        case 'runSwordSheath': {bodyData = scene.characterShapes.adventurer_runSwordSheath_00; break;}
        case 'jumpSwordSheath': {bodyData = scene.characterShapes.adventurer_jumpSwordSheath_00; break;}
        case 'fallSwordSheath': {bodyData = scene.characterShapes.adventurer_fallSwordSheath_00; break;}
        case 'wallSwordSheath': {bodyData = scene.characterShapes.adventurer_wallSwordSheath_00; break;}
        case 'ledgeSwordSheath': {bodyData = scene.characterShapes.adventurer_ledgeSwordSheath_00; break;}
        case 'idleSwing1': {bodyData = scene.characterShapes.adventurer_idleSwing1_00; break;}
        case 'idleSwing2': {bodyData = scene.characterShapes.adventurer_idleSwing2_00; break;}
        case 'runSwing': {bodyData = scene.characterShapes.adventurer_runSwing_00; break;}
        case 'airSwing1': {bodyData = scene.characterShapes.adventurer_airSwing1_00; break;}
        case 'airSwing2': {bodyData = scene.characterShapes.adventurer_airSwing2_00; break;}
        case 'airSwing3Start': {bodyData = scene.characterShapes.adventurer_airSwing3Start_00; break;}
        case 'airSwing3Loop': {bodyData = scene.characterShapes.adventurer_airSwing3Loop_00; break;}
        case 'airSwing3End': {bodyData = scene.characterShapes.adventurer_airSwing3End_00; break;}
        case 'wallSwing': {bodyData = scene.characterShapes.adventurer_wallSwing_00; break;}
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