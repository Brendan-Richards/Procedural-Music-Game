import { setCollisionMask } from '../Collisions';

const movementUpdate = (bot, scene) => {

    const prevVelocity = {x: bot.vx, y: bot.vy};

    if(bot.playerCanJump){
        //console.log(bot.timer.getTime());
        const timeDiff = Date.now() - bot.playerLastOnGroundTime;
        // //console.log('time since last on ground', timeDiff);
        // if(timeDiff > 100){
        // if(!bot.inContactWithGround){
        //     bot.playerCanJump = false;
        // }
        // else{
            groundCharacter(bot, prevVelocity, scene);
       // }
    }
    else{
        airborneCharacter(bot, prevVelocity, scene);
    }

    //limit player's max speed to avoid going through collision boxes
    if(bot.playerMaxSpeed < Math.abs(bot.vx)){
        const factor = bot.currentPlayerDirection==='left' ? -1 : 1;
        bot.vx = factor*bot.playerMaxSpeed;
    }
    if(bot.playerMaxSpeed < Math.abs(bot.vy)){
        bot.vy = bot.vy > 0 ? bot.playerMaxSpeed : -1 * bot.playerMaxSpeed;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const groundCharacter = (bot, prevVelocity, scene) => {
    //console.log('in ground character');
    // set the animation
    if(bot.playerAttacking){
        groundPlayerAttacking(scene, bot);
    }
    else if (bot.controlConfig.jumpControl.isDown && bot.controlConfig.jumpControl.timeDown > bot.prevJumpTime){
        //console.log('ground jump time:', Date.now());
        groundPlayerJump(scene, bot);
    }    
    else if (bot.controlConfig.leftControl.isDown){
        if(!((bot.currentPlayerAnimation==='run' || bot.currentPlayerAnimation==='runSword' || bot.currentPlayerAnimation==='runSwordDrawn' || bot.currentPlayerAnimation==='runBowDrawn' || bot.currentPlayerAnimation==='runGlove')  && bot.currentPlayerDirection==='left')){
            let animation = '';
            switch(bot.equippedWeapon){
                case 'glove': {animation = 'runGlove'; break;}
                case 'bow': {animation = 'runBowDrawn'; break;}
                case 'none': {animation = 'run'; break;}
                case 'sword': {animation = 'runSwordDrawn'; break;}
            }
            setNewCharacterAnimation(scene, bot, animation, true, false);
        }
    }
    else if (bot.controlConfig.rightControl.isDown){
        if(!((bot.currentPlayerAnimation==='run' || bot.currentPlayerAnimation==='runSword' || bot.currentPlayerAnimation==='runSwordDrawn' || bot.currentPlayerAnimation==='runBowDrawn' || bot.currentPlayerAnimation==='runGlove')  && bot.currentPlayerDirection==='right')){
            let animation = '';
            switch(bot.equippedWeapon){
                case 'glove': {animation = 'runGlove'; break;}
                case 'bow': {animation = 'runBowDrawn'; break;}
                case 'none': {animation = 'run'; break;}
                case 'sword': {animation = 'runSwordDrawn'; break;}
            }
            setNewCharacterAnimation(scene, bot, animation, false, false);        
        }
    }
    else{
        if(bot.currentPlayerAnimation!=='idle' && bot.currentPlayerAnimation!=='idleSword' && bot.currentPlayerAnimation!=='idleSwordDrawn' && bot.currentPlayerAnimation!=='idleBowDrawn' && bot.currentPlayerAnimation!=='idleGlove'){
            let animation = '';
            switch(bot.equippedWeapon){
                case 'glove': {animation = 'idleGlove'; break;}
                case 'bow': {animation = 'idleBowDrawn'; break;}
                case 'none': {animation = 'idle'; break;}
                case 'sword': {animation = 'idleSwordDrawn'; break;}
            }
            setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
        }
    }
    bot.velocityType = 'ground';
    setGroundVelocity(bot, prevVelocity);
    
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
const groundPlayerAttacking = (scene, bot) => {

    //console.log('in ground player attacking');
    if(bot.equippedWeapon==='sword'){

        if(!bot.swordAttacks.includes(bot.currentPlayerAnimation) && Date.now() - bot.lastAttackTime > 500){
            let swing = '';
            if(!bot.heavyAttack){
                switch(bot.prevSwordSwing){
                    case 'idleSwing1': {swing = 'idleSwing2'; bot.prevSwordSwing = 'idleSwing2'; break;}
                    case 'idleSwing2': {swing = 'idleSwing1'; bot.prevSwordSwing = 'idleSwing1'; break;}
                    default: {swing = 'idleSwing1'; bot.prevSwordSwing = 'idleSwing1'; break;}
                }
            }
            else{
                bot.prevSwordSwing = 'runSwing';
                swing = 'runSwing';
                bot.heavyAttack = false;
            }

            setNewCharacterAnimation(scene, bot, swing, bot.currentPlayerDirection==='left', false);
            bot.lastAttackTime = Date.now();
           // bot.stamina -= bot.attackStaminaPenalty;

        }
    }
    else if(bot.equippedWeapon==='bow'){
        if(bot.bowKick){
            setNewCharacterAnimation(scene, bot, 'bowKick', bot.currentPlayerDirection==='left', false);
        }
        else if(bot.currentPlayerAnimation==='idleHoldLoop' || bot.currentPlayerAnimation==='runHoldLoop'){
            if (bot.controlConfig.jumpControl.isDown && bot.controlConfig.jumpControl.timeDown > bot.prevJumpTime){
                setNewCharacterAnimation(scene, bot, 'jumpHoldLoop', bot.currentPlayerDirection==='left', false);
                bot.playerCanJump = false;
                bot.playerFlatSliding = false;
                bot.playerRampSliding = false;
                bot.prevJumpTime = bot.controlConfig.jumpControl.timeDown;
            }
            else if(bot.bowRelease){
                let animation = '';
                switch(bot.currentPlayerAnimation){
                    case 'idleHoldLoop': { animation = 'idleRelease'; break; }
                    case 'runHoldLoop': { animation = 'runRelease'; break; }
                }
                setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
            }
            else if(bot.currentPlayerAnimation==='idleHoldLoop'){
                if(bot.controlConfig.leftControl.isDown){
                    setNewCharacterAnimation(scene, bot, 'runHoldLoop', true, false);
                }
                else if(bot.controlConfig.rightControl.isDown){
                    setNewCharacterAnimation(scene, bot, 'runHoldLoop', false, false);
                }
            }
            else{// bot.currentPlayerAnimation==='runHoldLoop'
                if(bot.controlConfig.leftControl.isDown && bot.currentPlayerDirection==='right'){
                    setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, true, false);
                }
                else if(bot.controlConfig.rightControl.isDown && bot.currentPlayerDirection==='left'){
                    setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, false, false);
                }
                else if(bot.controlConfig.rightControl.isUp && bot.controlConfig.leftControl.isUp){
                    setNewCharacterAnimation(scene, bot, 'idleHoldLoop', bot.currentPlayerDirection==='left', false);
                }
            }
        }
        else if(bot.currentPlayerAnimation==='idleNotch' || bot.currentPlayerAnimation==='runNotch'){
            if(bot.controlConfig.jumpControl.isDown && bot.controlConfig.jumpControl.timeDown > bot.prevJumpTime){
                const factor = bot.currentPlayerDirection==='left' ? -1 : 1;
                const jumpX = bot.currentPlayerAnimation==='idleNotch' ? 0 : factor*bot.playerSpeed;
                const jumpY = -1*bot.playerJumpHeight;
                
                setNewCharacterAnimation(scene, bot, 'jumpNotch', bot.currentPlayerDirection==='left', false);
                bot.vx = jumpX;
                bot.vy = jumpY;
            }
            else if(bot.controlConfig.leftControl.isDown && (bot.currentPlayerDirection==='right' || bot.currentPlayerAnimation==='idleNotch')){
                setNewCharacterAnimation(scene, bot, 'runNotch', true, false);
            }
            else if(bot.controlConfig.rightControl.isDown && (bot.currentPlayerDirection==='left' || bot.currentPlayerAnimation==='idleNotch')){
                setNewCharacterAnimation(scene, bot, 'runNotch', false, false);
            }
            else if(bot.controlConfig.rightControl.isUp && bot.controlConfig.leftControl.isUp && bot.currentPlayerAnimation!=='idleNotch'){
                setNewCharacterAnimation(scene, bot, 'idleNotch', bot.currentPlayerDirection==='left', false);
            }        
        }
        else if(bot.currentPlayerAnimation==='idleRelease' || bot.currentPlayerAnimation==='runRelease'){
            if(bot.controlConfig.leftControl.isDown && bot.currentPlayerDirection==='right'){
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, true, false);
            }
            else if(bot.controlConfig.rightControl.isDown && bot.currentPlayerDirection==='left'){
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, false, false);
            }
            else if(bot.controlConfig.rightControl.isUp && bot.controlConfig.leftControl.isUp && bot.currentPlayerAnimation!=='idleRelease'){
                setNewCharacterAnimation(scene, bot, 'idleRelease', bot.currentPlayerDirection==='left', false);
            }               
        }
        else if(bot.currentPlayerAnimation==='fallHoldLoop'){ // hit the ground while notched in mid air
            setNewCharacterAnimation(scene, bot, 'idleHoldLoop', bot.currentPlayerDirection==='left', false);
        }
        else if(!bot.bowAttacks.includes(bot.currentPlayerAnimation)){
            let animation = '';
            switch(bot.currentPlayerAnimation){
                case 'runBowDrawn': { animation = 'runNotch'; break; }
                case 'idleBowDrawn':
                default: { animation = 'idleNotch'; break; }
            }
            setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
const groundPlayerJump = (scene, bot) => {
    let animationName = '';
    switch(bot.equippedWeapon){
        case 'glove': {animationName = 'jumpGlove'; break;}
        case 'bow': {animationName = 'jumpBowDrawn'; break;}
        case 'none': {animationName = 'jump'; break;}
        case 'sword': {animationName = 'jumpSwordDrawn'; break;}
    }
    setNewCharacterAnimation(scene, bot, animationName, bot.currentPlayerDirection==='left', false);   
    bot.playerCanJump = false;
    bot.playerFlatSliding = false;
    bot.playerRampSliding = false;
    bot.prevJumpTime = bot.controlConfig.jumpControl.timeDown;
    //console.log('jump time:', this.prevJumpTime);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
const setGroundVelocity = (bot, prevVelocity) => {
    //set the characters speed depending on the active animation and active direction
    switch(bot.currentPlayerAnimation){
        case 'idleSwing1':
        case 'idleSwing2':
        case 'idleCastRed':
        case 'idleCastBlue':
        case 'runSwing':
        case 'bowKick':
        case 'idleSwordDrawn':
        case 'idleBowDrawn':
        case 'idleNotch':
        case 'idleHoldLoop':
        case 'idleGlove':
        case 'idle': {
            bot.vx = 0;
            bot.vy = prevVelocity.y;
            break;
        }
        case 'runHoldLoop':
        case 'runNotch':
        case 'runCastRed':
        case 'runCastBlue':
        case 'runRelease':
        case 'runSwordDrawn':
        case 'runBowDrawn':
        case 'runGlove':
        case 'run': {
            if(bot.currentPlayerDirection==='right'){
                bot.vx = bot.playerSpeed;
                bot.vy = prevVelocity.y;
                break;
            }
            else if(bot.currentPlayerDirection==='left'){
                bot.vx = -1*bot.playerSpeed;
                bot.vy = prevVelocity.y;
                break;
            }
            else{
                console.log("don't understand previous character direction");
                break;
            }
        }
        case 'jumpSwordDrawn':
        case 'jumpBowDrawn':
        case 'jumpGlove':
        case 'jumpHoldLoop':
        case 'jump': {
            if(bot.prevPlayerAnimation==='idle' || bot.prevPlayerAnimation==='idleSword' || bot.prevPlayerAnimation==='idleSwordDrawn' || bot.prevPlayerAnimation==='idleBowDrawn' || bot.prevPlayerAnimation==='idleGlove' || bot.prevPlayerAnimation==='idleCastRed' || bot.prevPlayerAnimation==='idleCastBlue'  || bot.prevPlayerAnimation==='jumpCastRed'  || bot.prevPlayerAnimation==='jumpCastBlue' || bot.prevPlayerAnimation==='fallGlove'){
                bot.vx = prevVelocity.x;
                bot.vy = -1*bot.playerJumpHeight;
            }
            else{
                const factor = bot.currentPlayerDirection==='left' ? -1 : 1;
                bot.vx = factor*bot.playerSpeed;
                bot.vy = -1*bot.playerJumpHeight;
            }
            break;
        } 
        default: break;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
const airborneCharacter = (bot, prevVelocity, scene) => {
    if(bot.playerWallJumping){
        //bot.wallTolerance = 40;
        const prevX = bot.wallJumpOffPosition.x;
        const currX = bot.x
        const distance = Math.abs(currX-prevX);

        if(distance > bot.wallTolerance){
            bot.playerWallJumping = false; 
        }
    }
    else if(bot.playerAttacking){
        airPlayerAttacking(scene, bot, prevVelocity);
    }
    else if(bot.playerWallSliding){
        playerWallSliding(scene, bot);
    }
    else{
        if(prevVelocity.y >= 0){ // player moving down
            //console.log('checking if we can still do a wall jump');
            const buffer = 20; // how far we can be from the wall and still do a wall jump
            const withinWallJumpRange = bot.x > bot.stopWallSlidingPosition.x - buffer && bot.x < bot.stopWallSlidingPosition.x + buffer;
            //console.log('withinWallJumpRange:', withinWallJumpRange);
            const validJump = bot.controlConfig.jumpControl.isDown && bot.controlConfig.jumpControl.timeDown > bot.prevJumpTime;
            //console.log('validJump:', validJump);
            //const canWallSlideAgain = bot.x===bot.stopWallSlidingPosition.x;

            if(withinWallJumpRange && validJump && bot.stopWallSlidingDirection===bot.currentPlayerDirection){
                let animationName = '';
                
                switch(bot.equippedWeapon){
                    case 'glove': {animationName = 'jumpGlove'; break;}
                    case 'bow': {animationName = 'jumpBowDrawn'; break;}
                    case 'none': {animationName = 'jump'; break;}
                    case 'sword': {animationName = 'jumpSwordDrawn'; break;}
                }
                setNewCharacterAnimation(scene, bot, animationName, bot.currentPlayerDirection==='left', false); 
                
                const factor = bot.currentPlayerDirection==='left' ? -1 : 1;
                //bot.player.setPosition(bot.player.body.position.x + (-1*factor*100), bot.player.body.position.y);

                const jumpX = factor*bot.playerSpeed;
                const jumpY = bot.playerIceWallSliding ? bot.playerIceJumpHeight : bot.playerWallJumpHeight;
                bot.vx = jumpX;
                bot.vy = jumpY;

                bot.playerCanJump = false;        
                bot.playerWallSliding = false;   
                bot.playerWallJumping = true;  
                // bot.wallJumpOffPosition = {...bot.playerBody.position};
                bot.wallJumpOffPosition = {x: bot.x, y: bot.y};  
                bot.prevJumpTime = bot.controlConfig.jumpControl.timeDown;

                console.log('set player to wall jump from fall next to wall');
                               
            }
            else if(bot.currentPlayerAnimation!=='fall' && bot.currentPlayerAnimation!=='fallSword' && bot.currentPlayerAnimation!=='fallSwordDrawn' && bot.currentPlayerAnimation!=='fallBowDrawn' && bot.currentPlayerAnimation!=='fallGlove'){
                let animationName = '';
                // console.log('setting fall animation');
                // console.log(bot.equippedWeapon);
                switch(bot.equippedWeapon){
                    case 'glove': {animationName = 'fallGlove'; break;}
                    case 'bow': {animationName = 'fallBowDrawn'; break;}
                    case 'none': {animationName = 'fall'; break;}
                    case 'sword': {animationName = 'fallSwordDrawn'; break;}
                }
                bot.playerFriction = 0;
                setNewCharacterAnimation(scene, bot, animationName, bot.currentPlayerDirection==='left', false);
            }
            else if (bot.controlConfig.leftControl.isDown && bot.controlConfig.rightControl.isUp)
            {
                //console.log('checking if player can start wall sliding again at position:', this.playerBody.position);
                //if(bot.playerBody.position.x===bot.stopWallSlidingPosition.x &&
                if(bot.x===bot.stopWallSlidingPosition.x && bot.stopWallSlidingDirection==='left'){
                        //console.log('resetting wall slide to left wall');
                        bot.playerWallSliding = true;
                }
                else if(bot.currentPlayerDirection!=='left'){
                    //if(bot.currentPlayerAnimation!=='fall' && bot.currentPlayerAnimation!=='fallSword' && bot.currentPlayerAnimation!=='fallSwordDrawn' && bot.currentPlayerAnimation!=='fallbowDrawn'){
                        let animationName = '';
                        // console.log('setting fall animation');
                        // console.log(bot.equippedWeapon);
                        switch(bot.equippedWeapon){
                            case 'glove': {animationName = 'fallGlove'; break;}
                            case 'bow': {animationName = 'fallBowDrawn'; break;}
                            case 'none': {animationName = 'fall'; break;}
                            case 'sword': {animationName = 'fallSwordDrawn'; break;}
                        }
                        bot.playerFriction = 0;
                        setNewCharacterAnimation(scene, bot, animationName, true, false);
                   // }
                }
            }
            else if (bot.controlConfig.rightControl.isDown && bot.controlConfig.leftControl.isUp)
            {
                //console.log('checking if player can start wall sliding again at position:');
                if(bot.x===bot.stopWallSlidingPosition.x && bot.stopWallSlidingDirection==='right'){
                        //console.log('resetting wall slide to right wall');
                        bot.playerWallSliding = true;
                 }

                else if(bot.currentPlayerDirection!=='right'){
                        let animationName = '';
                        // console.log('setting fall animation');
                        // console.log(bot.equippedWeapon);
                        switch(bot.equippedWeapon){
                            case 'glove': {animationName = 'fallGlove'; break;}
                            case 'bow': {animationName = 'fallBowDrawn'; break;}
                            case 'none': {animationName = 'fall'; break;}
                            case 'sword': {animationName = 'fallSwordDrawn'; break;}
                        }
                        bot.playerFriction = 0;
                        setNewCharacterAnimation(scene, bot, animationName, false, false);
                }
            }

        }
        else{// player is still moving up
            if (bot.controlConfig.rightControl.isDown && bot.currentPlayerDirection!=='right'){
                bot.currentPlayerDirection = 'right';
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, false, false);        
            }       
            else if (bot.controlConfig.leftControl.isDown && bot.currentPlayerDirection!=='left'){
                bot.currentPlayerDirection = 'left';
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, true, false);
            }    
        }
    }
    bot.velocityType = 'air';
    setAirVelocity(bot, prevVelocity);
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////
const playerWallSliding = (scene, bot) => {
        //start wallsliding
        console.log('in player wall sliding function for bot');

        if(Date.now() - bot.prevJumpTime < bot.noFrictionWindow){
            bot.playerFriction = 0;
        }
        else{
            bot.playerFriction = 0.3;
        }

        //console.log('checking if we should change player animation to wall slide')
        if((bot.currentPlayerAnimation!=='wallSlideSwordDrawn' && bot.currentPlayerAnimation!=='wallSlideBowDrawn' && bot.currentPlayerAnimation!=='wallSlideGlove') || bot.resetWallSlide){
            //console.log('changing to wall slide animation');
            
            let animation = '';
            switch(bot.equippedWeapon){
                case 'glove': {animation = 'wallSlideGlove'; break;}
                case 'bow': {animation = 'wallSlideBowDrawn'; break;}
                case 'none': {animation = 'wallSlide'; break;}
                case 'sword': {animation = 'wallSlideSwordDrawn'; break;}
            }
            setNewCharacterAnimation(scene, bot, animation, bot.lastWallCollisionDirection==='left', false);
        }

        //jump off the wall
        if(bot.controlConfig.jumpControl.isDown && bot.controlConfig.jumpControl.timeDown > bot.prevJumpTime){
            //console.log('jump off wall');
            //flip the players direction cause they were facing the opposite way when on the wall
            bot.currentPlayerDirection = bot.currentPlayerDirection==='left' ? 'right' : 'left';
            //const animationName = bot.swordDrawn ? 'jumpSword' : 'jump';
            let animation = '';
            switch(bot.equippedWeapon){
                case 'glove': {animation = 'jumpGlove'; break;}
                case 'bow': {animation = 'jumpBowDrawn'; break;}
                case 'none': {animation = 'jump'; break;}
                case 'sword': {animation = 'jumpSwordDrawn'; break;}
            }
            bot.stopWallSlidingPosition = {x: bot.x, y: bot.y};
            setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
            //console.log('player direction at tiem of wall jump:', bot.currentPlayerDirection);

            const factor = bot.currentPlayerDirection==='left' ? -1 : 1;
            const jumpX = factor*bot.playerSpeed;
            const jumpY = bot.playerIceWallSliding ? bot.playerIceJumpHeight : bot.playerWallJumpHeight;
            bot.vx = jumpX;
            bot.vy = jumpY;
            //console.log('player velocity:', jumpX, jumpY);
            
            bot.playerCanJump = false;        
            bot.playerWallSliding = false;
            bot.playerIceWallSliding = false;   
            bot.playerWallJumping = true;  
            // bot.wallJumpOffPosition = {...bot.playerBody.position};
            bot.wallJumpOffPosition = {x: bot.x, y: bot.y};  
            bot.prevJumpTime = bot.controlConfig.jumpControl.timeDown;
            //console.log('jujst set player wall jump position as:', this.wallJumpOffPosition);
            bot.stopWallSlidingDirection = bot.currentPlayerDirection;
            bot.inContactWithWall = false;
        }
        else{//check if we should stop wall sliding
            if(bot.controlConfig.rightControl.isDown  && bot.controlConfig.leftControl.isUp && bot.currentPlayerDirection!=='right' ||
                bot.controlConfig.leftControl.isDown  && bot.controlConfig.rightControl.isUp && bot.currentPlayerDirection!=='left'){
                   console.log('stopping wall slide');
                   bot.playerFriction = 0;
                   //flip the players direction cause they were facing the opposite way when on the wall
                   
                   bot.currentPlayerDirection = bot.currentPlayerDirection==='left' ? 'right' : 'left';
                   bot.stopWallSlidingDirection = bot.currentPlayerDirection;
                   
                   //console.log('checking if player can start wall sliding again at position:');
                   bot.stopWallSlidingPosition = {x: bot.x, y: bot.y}; 
                   //const animationName = bot.swordDrawn ? 'fallSword' : 'fall';
                   let animation = '';
                   switch(bot.equippedWeapon){
                    case 'glove': {animation = 'fallGlove'; break;}
                       case 'bow': {animation = 'fallBowDrawn'; break;}
                       case 'none': {animation = 'fall'; break;}
                       case 'sword': {animation = 'fallSwordDrawn'; break;}
                   }
                   setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
                   bot.playerWallSliding = false;
                   bot.playerIceWallSliding = false;
               }
        }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
const airPlayerAttacking = (scene, bot, prevVelocity) => {
    if(bot.equippedWeapon==='sword'){
        if(bot.downAttack){
            if(bot.currentPlayerAnimation !== 'airSwing3Start' && bot.currentPlayerAnimation !== 'airSwing3Loop' && bot.currentPlayerAnimation !== 'airSwing3End'){
                //console.log('setting animation to downward airAttack');
                setNewCharacterAnimation(scene, bot, 'airSwing3Start', bot.currentPlayerDirection==='left', false);
                
            }
        }
        else if(bot.playerWallSliding){
            if(bot.currentPlayerAnimation !== 'wallSwing'){
                bot.stopWallSlidingPosition = {x: bot.x, y: bot.y};
                setNewCharacterAnimation(scene, bot, 'wallSwing', bot.currentPlayerDirection==='left', false);
                //bot.stamina -= bot.attackStaminaPenalty;
                bot.lastAttackTime = Date.now();
            }
        }
        else if((bot.currentPlayerAnimation !== 'airSwing1' && bot.currentPlayerAnimation !== 'airSwing2') && Date.now() - bot.lastAttackTime > 500){
            //console.log('setting animation to airSwing');
            let swing = '';
            if(!bot.heavyAttack){
                swing = 'airSwing2'; 
                bot.prevSwordSwing = 'airSwing2';
            }
            else{
                swing = 'airSwing1'; 
                bot.prevSwordSwing = 'airSwing1';
                bot.heavyAttack = false;
            }
            setNewCharacterAnimation(scene, bot, swing, bot.currentPlayerDirection==='left', false);
            bot.lastAttackTime = Date.now(); 
            //bot.stamina -= bot.attackStaminaPenalty;
        }
    }
    else if(bot.equippedWeapon==='bow'){
        if(bot.currentPlayerAnimation==='jumpHoldLoop' || bot.currentPlayerAnimation==='fallHoldLoop'){
            if(bot.bowRelease){
                let animation = '';
                switch(bot.currentPlayerAnimation){
                    case 'jumpHoldLoop': { animation = 'jumpRelease'; break; }
                    case 'fallHoldLoop': { animation = 'fallRelease'; break; }
                }
                setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
            }
            else if(bot.currentPlayerAnimation==='jumpHoldLoop' && prevVelocity.y >= 0){
                setNewCharacterAnimation(scene, bot, 'fallHoldLoop', bot.currentPlayerDirection==='left', false);
            }
            else{
                if(bot.controlConfig.leftControl.isDown && bot.currentPlayerDirection==='right'){
                    setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, true, false);
                }
                else if(bot.controlConfig.rightControl.isDown && bot.currentPlayerDirection==='left'){
                    setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, false, false);
                }
            }
        }
        else if(bot.currentPlayerAnimation==='jumpNotch' || bot.currentPlayerAnimation==='fallNotch'){
            if(bot.controlConfig.leftControl.isDown && bot.currentPlayerDirection==='right'){
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, true, false);
            }
            else if(bot.controlConfig.rightControl.isDown && bot.currentPlayerDirection==='left'){
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, false, false);
            }              
        }
        else if(bot.currentPlayerAnimation==='jumpRelease' || bot.currentPlayerAnimation==='fallRelease'){
            if(bot.controlConfig.leftControl.isDown && bot.currentPlayerDirection==='right'){
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, true, false);
            }
            else if(bot.controlConfig.rightControl.isDown && bot.currentPlayerDirection==='left'){
                setNewCharacterAnimation(scene, bot, bot.currentPlayerAnimation, false, false);
            }             
        }
        else if(!bot.bowAttacks.includes(bot.currentPlayerAnimation)){
            let animation = '';
            switch(bot.currentPlayerAnimation){
                case 'jumpBowDrawn': { animation = 'jumpNotch'; break; }
                case 'fallBowDrawn': { animation = 'fallNotch'; break; }
            }
            setNewCharacterAnimation(scene, bot, animation, bot.currentPlayerDirection==='left', false);
        }
        else if(bot.currentPlayerAnimation==='runHoldLoop'){
            setNewCharacterAnimation(scene, bot, 'fallHoldLoop', bot.currentPlayerDirection==='left', false);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
const setAirVelocity = (bot, prevVelocity) => {
    //set the characters speed depending on the active animation and active direction
    switch(bot.currentPlayerAnimation){
        case 'wallSlideSwordDrawn':
        case 'wallSlideBowDrawn':
        case 'wallSwing':
        case 'wallSlideGlove':
        case 'wallSlide': {
            break;
        }
        case 'ledgeGrab':
        case 'ledgeGrabGlove':
        case 'ledgeGrabSwordDrawn':
        case 'ledgeGrabBowDrawn': {
            bot.vx = 0;
            bot.vy = 0;
            break;
        }
        case 'airSwing3Start':
        case 'airSwing3Loop': {
            bot.vx = 0;
            bot.vy = bot.playerMaxSpeed;
            break;
        }
        case 'fallHoldLoop': {
            if(bot.inContactWithWall){
                bot.vx = 0;
                bot.vy = prevVelocity.y;
                break;
            }
        }
       // case 'jumpGlove':
        case 'jumpCastRed':
        case 'jumpCastBlue':{
            if(['wallSlideCastRed', 'wallSlideCastBlue', 'fallCastRed', 'fallCastBlue'].includes(bot.prevPlayerAnimation)){
                break;
            }
        }
        case 'fallCastRed':
        case 'fallCastBlue':
        case 'airSwing1':
        case 'airSwing2':
        case 'jumpNotch':
        case 'fallNotch':
        case 'fallGlove':
        case 'fallSwordDrawn':
        case 'fallBowDrawn':
        case 'jumpHoldLoop':
        case 'fallRelease':
        case 'jumpRelease':
        case 'airKick':
        case 'fall': {
            if(bot.currentPlayerDirection==='right' && bot.controlConfig.rightControl.isDown){
                bot.vx = bot.playerSpeed;
                bot.vy = prevVelocity.y;
                break;
            }
            else if(bot.currentPlayerDirection==='left' && bot.controlConfig.leftControl.isDown){
                bot.vx = -1*bot.playerSpeed;
                bot.vy = prevVelocity.y;
                break;
            }
            else{
                bot.vx = 0;
                bot.vy = prevVelocity.y;
                break;
            }
        } 
        case 'jumpSwordDrawn':
        case 'jumpBowDrawn':
        case 'jumpGlove':
        case 'jump': {
            if(!bot.playerLedgeClimb){
                if(bot.controlConfig.rightControl.isDown && !bot.playerWallJumping){
                    bot.vx = bot.playerSpeed;
                    bot.vy = prevVelocity.y;
                    break;
                }
                else if(bot.controlConfig.leftControl.isDown && !bot.playerWallJumping){
                    bot.vx = -1*bot.playerSpeed;
                    bot.vy = prevVelocity.y;
                    break;
                }
                else if(bot.playerWallJumping){
                    const factor = bot.currentPlayerDirection==='left' ? 1 : -1;
                    //bot.matter.setVelocity(bot.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*bot.playerSpeed, -2.5*bot.playerSpeed); 
                }
                else if(bot.controlConfig.leftControl.isUp && bot.controlConfig.rightControl.isUp){
                    bot.vx = 0;
                    bot.vy = prevVelocity.y;
                    break;
                }
            }
        }
        default: break;
    }
}

const setNewCharacterAnimation = (scene, bot, animationName, flipX, flipY, startFrameIndex = 0, interrupt = true) => {


    if(animationName !== bot.currentPlayerAnimation || bot.currentPlayerDirection==='left' && !flipX || bot.currentPlayerDirection==='right' && flipX){

        const opponentData = {
            currentAnimation: animationName,
            flipX: flipX,
            playerFriction: bot.playerFriction,
            velocityType: bot.velocityType,
            prevOpponentAnimation: bot.currentPlayerAnimation
        }

        bot.prevPlayerAnimation = bot.currentPlayerAnimation;
        bot.currentPlayerAnimation = animationName;
    
        bot.prevPlayerDirection = bot.currentPlayerDirection;
        bot.currentPlayerDirection = flipX ? 'left' : 'right';

        scene.opponent.setScale(1);
        
        scene.opponent.setScale((opponentData.flipX ? -1 : 1)*scene.playerScaleFactor, scene.playerScaleFactor);
    
        let suffix = '';

        switch(scene.opponentHealth){
            case 100: {suffix = '100'; break;}
            case 75: {suffix = '075'; break;}
            case 50: {suffix = '050'; break;}
            case 25: {suffix = '025'; break;}
            case 0: {suffix = '000'; break;}
        }

        //console.log('setting opponent animation to:', opponentData.currentAnimation + 'Opponent' + suffix);

        scene.opponent.play(opponentData.currentAnimation + 'Opponent' + suffix, false, 0);  

        scene.opponent.setBounce(0);
        scene.opponent.setFixedRotation(); 

        scene.currentOpponentDirection = opponentData.flipX ? 'left' : 'right';
        scene.currentOpponentAnimation = opponentData.currentAnimation + 'Opponent';

        if(scene.opponentAttackBox){
            scene.matter.world.remove(scene.opponentAttackBox);
            scene.opponentAttackBox = null;
        }
        if(scene.swordAttacks.includes(opponentData.currentAnimation) || ['bowKick', 'airSwing3Loop'].includes(opponentData.currentAnimation)){
            //console.log('entered if statement to create new opponent box');
            
            let xOffset = 0;
            let yOffset = 0;
            let radius = 10
            const factor = opponentData.flipX ? -1 : 1;
            switch(opponentData.currentAnimation){
                case 'airSwing3Loop': {xOffset = 0; yOffset = 0; radius = 14; break;}
                case 'wallSwing': {xOffset = -10; yOffset = 0; radius = 13; break;}
                case 'bowKick': {xOffset = 8; yOffset = 1; radius = 9; break;}
                case 'airSwing1': {xOffset = 4; yOffset = -5; radius = 15; break;}
                case 'airSwing2': {xOffset = 7; yOffset = -3; radius = 15; break;}
                case 'runSwing': {xOffset = 6; yOffset = 0; radius = 14; break;}
                case 'idleSwing1': {xOffset = 6; yOffset = -1; radius = 13; break;}
                case 'idleSwing2': {xOffset = 7; yOffset = -6; radius = 14; break;}
            }

            scene.opponentAttackBox = scene.matter.add.circle(scene.opponent.x + (factor * xOffset), scene.opponent.y + yOffset, radius, {
                label: 'opponentBox',
                ignoreGravity: true,
                frictionAir: 0,
                friction: 0,
                collisionFilter: {
                    group: scene.opponentGroup
                }
            });

            const gameObj = scene.add.circle(scene.opponent.x + (factor * xOffset), scene.opponent.y + yOffset, radius, undefined, 0);
            gameObj.body = scene.opponentAttackBox;
            scene.opponentAttackBox.collisionFilter.category = scene.collisionCategories.opponentBox;
            //console.log('dummy opponent game obj:', gameObj);
            setCollisionMask(scene, gameObj, ['terrain', 'opponent', 'opponentBox', 'opponentArrow', 'playerMagic', 'opponentMagic', 'playerExplosion', 'opponentExplosion']);
            //console.log('dummy game obj after setting collision:', gameObj);

            if(opponentData.currentAnimation==='airSwing3Loop'){
                //console.log('entered if statement to set opponent box velocity');
                //scene.matter.setVelocity(scene.opponentAttackBox as Phaser.Types.Physics.Matter.MatterBody, 0, scene.playerMaxSpeed + 0.3);
            }
        }

        // if(bot.swordAttacks.includes(bot.prevPlayerAnimation)){
        //     bot.playerAttacking = false;
        // }

    }

}


exports.movementUpdate = movementUpdate;