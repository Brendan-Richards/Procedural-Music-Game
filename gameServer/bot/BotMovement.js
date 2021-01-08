

const movementUpdate = (scene, io) => {

    const prevVelocity = {x: scene.vx, y: scene.vy};

    if(scene.playerCanJump){
        //console.log(scene.timer.getTime());
        // const timeDiff = Date.now() - scene.playerLastOnGroundTime;
        // //console.log('time since last on ground', timeDiff);
        // if(timeDiff > 100){
        //      scene.playerCanJump = false;
        // }
        // else{
            groundCharacter(scene, prevVelocity, io);
        //}
    }
    else{
        airborneCharacter(scene, prevVelocity, io);
    }

    //limit player's max speed to avoid going through collision boxes
    if(scene.playerMaxSpeed < Math.abs(scene.vx)){
        const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
        scene.vx = factor*scene.playerMaxSpeed;
    }
    if(scene.playerMaxSpeed < Math.abs(scene.vy)){
        scene.vy = scene.vy > 0 ? scene.playerMaxSpeed : -1 * scene.playerMaxSpeed;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const groundCharacter = (scene, prevVelocity, io) => {
    //console.log('in ground character');
    // set the animation
    if(scene.playerAttacking){
        groundPlayerAttacking(io, scene);
    }
    else if (scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
        //console.log('ground jump time:', Date.now());
        groundPlayerJump(io, scene);
    }    
    else if (scene.controlConfig.leftControl.isDown){
        if(!((scene.currentPlayerAnimation==='run' || scene.currentPlayerAnimation==='runSword' || scene.currentPlayerAnimation==='runSwordDrawn' || scene.currentPlayerAnimation==='runBowDrawn' || scene.currentPlayerAnimation==='runGlove')  && scene.currentPlayerDirection==='left')){
            let animation = '';
            switch(scene.equippedWeapon){
                case 'glove': {animation = 'runGlove'; break;}
                case 'bow': {animation = 'runBowDrawn'; break;}
                case 'none': {animation = 'run'; break;}
                case 'sword': {animation = 'runSwordDrawn'; break;}
            }
            setNewCharacterAnimation(io, scene, animation, true, false);
        }
    }
    else if (scene.controlConfig.rightControl.isDown){
        if(!((scene.currentPlayerAnimation==='run' || scene.currentPlayerAnimation==='runSword' || scene.currentPlayerAnimation==='runSwordDrawn' || scene.currentPlayerAnimation==='runBowDrawn' || scene.currentPlayerAnimation==='runGlove')  && scene.currentPlayerDirection==='right')){
            let animation = '';
            switch(scene.equippedWeapon){
                case 'glove': {animation = 'runGlove'; break;}
                case 'bow': {animation = 'runBowDrawn'; break;}
                case 'none': {animation = 'run'; break;}
                case 'sword': {animation = 'runSwordDrawn'; break;}
            }
            setNewCharacterAnimation(io, scene, animation, false, false);        
        }
    }
    else{
        if(scene.currentPlayerAnimation!=='idle' && scene.currentPlayerAnimation!=='idleSword' && scene.currentPlayerAnimation!=='idleSwordDrawn' && scene.currentPlayerAnimation!=='idleBowDrawn' && scene.currentPlayerAnimation!=='idleGlove'){
            let animation = '';
            switch(scene.equippedWeapon){
                case 'glove': {animation = 'idleGlove'; break;}
                case 'bow': {animation = 'idleBowDrawn'; break;}
                case 'none': {animation = 'idle'; break;}
                case 'sword': {animation = 'idleSwordDrawn'; break;}
            }
            setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
        }
    }
    setGroundVelocity(scene, prevVelocity);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
const groundPlayerAttacking = (io, scene) => {

    //console.log('in ground player attacking');
    if(scene.equippedWeapon==='sword'){

        if(!scene.swordAttacks.includes(scene.currentPlayerAnimation) && Date.now() - scene.lastAttackTime > 500){
            let swing = '';
            if(!scene.heavyAttack){
                switch(scene.prevSwordSwing){
                    case 'idleSwing1': {swing = 'idleSwing2'; scene.prevSwordSwing = 'idleSwing2'; break;}
                    case 'idleSwing2': {swing = 'idleSwing1'; scene.prevSwordSwing = 'idleSwing1'; break;}
                    default: {swing = 'idleSwing1'; scene.prevSwordSwing = 'idleSwing1'; break;}
                }
            }
            else{
                scene.prevSwordSwing = 'runSwing';
                swing = 'runSwing';
                scene.heavyAttack = false;
            }

            setNewCharacterAnimation(io, scene, swing, scene.currentPlayerDirection==='left', false);
            scene.lastAttackTime = Date.now();
           // scene.stamina -= scene.attackStaminaPenalty;

        }
    }
    else if(scene.equippedWeapon==='bow'){
        if(scene.bowKick){
            setNewCharacterAnimation(io, scene, 'bowKick', scene.currentPlayerDirection==='left', false);
        }
        else if(scene.currentPlayerAnimation==='idleHoldLoop' || scene.currentPlayerAnimation==='runHoldLoop'){
            if (scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
                setNewCharacterAnimation(io, scene, 'jumpHoldLoop', scene.currentPlayerDirection==='left', false);
                scene.playerCanJump = false;
                scene.playerFlatSliding = false;
                scene.playerRampSliding = false;
                scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;
            }
            else if(scene.bowRelease){
                let animation = '';
                switch(scene.currentPlayerAnimation){
                    case 'idleHoldLoop': { animation = 'idleRelease'; break; }
                    case 'runHoldLoop': { animation = 'runRelease'; break; }
                }
                setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
            }
            else if(scene.currentPlayerAnimation==='idleHoldLoop'){
                if(scene.controlConfig.leftControl.isDown){
                    setNewCharacterAnimation(io, scene, 'runHoldLoop', true, false);
                }
                else if(scene.controlConfig.rightControl.isDown){
                    setNewCharacterAnimation(io, scene, 'runHoldLoop', false, false);
                }
            }
            else{// scene.currentPlayerAnimation==='runHoldLoop'
                if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
                    setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, true, false);
                }
                else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
                    setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, false, false);
                }
                else if(scene.controlConfig.rightControl.isUp && scene.controlConfig.leftControl.isUp){
                    setNewCharacterAnimation(io, scene, 'idleHoldLoop', scene.currentPlayerDirection==='left', false);
                }
            }
        }
        else if(scene.currentPlayerAnimation==='idleNotch' || scene.currentPlayerAnimation==='runNotch'){
            if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
                const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                const jumpX = scene.currentPlayerAnimation==='idleNotch' ? 0 : factor*scene.playerSpeed;
                const jumpY = -1*scene.playerJumpHeight;
                
                setNewCharacterAnimation(io, scene, 'jumpNotch', scene.currentPlayerDirection==='left', false);
                scene.vx = jumpX;
                scene.vy = jumpY;
            }
            else if(scene.controlConfig.leftControl.isDown && (scene.currentPlayerDirection==='right' || scene.currentPlayerAnimation==='idleNotch')){
                setNewCharacterAnimation(io, scene, 'runNotch', true, false);
            }
            else if(scene.controlConfig.rightControl.isDown && (scene.currentPlayerDirection==='left' || scene.currentPlayerAnimation==='idleNotch')){
                setNewCharacterAnimation(io, scene, 'runNotch', false, false);
            }
            else if(scene.controlConfig.rightControl.isUp && scene.controlConfig.leftControl.isUp && scene.currentPlayerAnimation!=='idleNotch'){
                setNewCharacterAnimation(io, scene, 'idleNotch', scene.currentPlayerDirection==='left', false);
            }        
        }
        else if(scene.currentPlayerAnimation==='idleRelease' || scene.currentPlayerAnimation==='runRelease'){
            if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, true, false);
            }
            else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, false, false);
            }
            else if(scene.controlConfig.rightControl.isUp && scene.controlConfig.leftControl.isUp && scene.currentPlayerAnimation!=='idleRelease'){
                setNewCharacterAnimation(io, scene, 'idleRelease', scene.currentPlayerDirection==='left', false);
            }               
        }
        else if(scene.currentPlayerAnimation==='fallHoldLoop'){ // hit the ground while notched in mid air
            setNewCharacterAnimation(io, scene, 'idleHoldLoop', scene.currentPlayerDirection==='left', false);
        }
        else if(!scene.bowAttacks.includes(scene.currentPlayerAnimation)){
            let animation = '';
            switch(scene.currentPlayerAnimation){
                case 'runBowDrawn': { animation = 'runNotch'; break; }
                case 'idleBowDrawn':
                default: { animation = 'idleNotch'; break; }
            }
            setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
const groundPlayerJump = (io, scene) => {
    let animationName = '';
    switch(scene.equippedWeapon){
        case 'glove': {animationName = 'jumpGlove'; break;}
        case 'bow': {animationName = 'jumpBowDrawn'; break;}
        case 'none': {animationName = 'jump'; break;}
        case 'sword': {animationName = 'jumpSwordDrawn'; break;}
    }
    setNewCharacterAnimation(io, scene, animationName, scene.currentPlayerDirection==='left', false);   
    scene.playerCanJump = false;
    scene.playerFlatSliding = false;
    scene.playerRampSliding = false;
    scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;
    //console.log('jump time:', this.prevJumpTime);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
const setGroundVelocity = (scene, prevVelocity) => {
    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
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
            scene.vx = 0;
            scene.vy = prevVelocity.y;
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
            if(scene.currentPlayerDirection==='right'){
                scene.vx = scene.playerSpeed;
                scene.vy = prevVelocity.y;
                break;
            }
            else if(scene.currentPlayerDirection==='left'){
                scene.vx = -1*scene.playerSpeed;
                scene.vy = prevVelocity.y;
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
            if(scene.prevPlayerAnimation==='idle' || scene.prevPlayerAnimation==='idleSword' || scene.prevPlayerAnimation==='idleSwordDrawn' || scene.prevPlayerAnimation==='idleBowDrawn' || scene.prevPlayerAnimation==='idleGlove' || scene.prevPlayerAnimation==='idleCastRed' || scene.prevPlayerAnimation==='idleCastBlue'  || scene.prevPlayerAnimation==='jumpCastRed'  || scene.prevPlayerAnimation==='jumpCastBlue' || scene.prevPlayerAnimation==='fallGlove'){
                scene.vx = prevVelocity.x;
                scene.vy = -1*scene.playerJumpHeight;
            }
            else{
                const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                scene.vx = factor*scene.playerSpeed;
                scene.vy = -1*scene.playerJumpHeight;
            }
            break;
        } 
        default: break;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
const airborneCharacter = (scene, prevVelocity, io) => {
    if(scene.playerWallJumping){
        //scene.wallTolerance = 40;
        const prevX = scene.wallJumpOffPosition.x;
        const currX = scene.x
        const distance = Math.abs(currX-prevX);

        if(distance > scene.wallTolerance){
            scene.playerWallJumping = false; 
        }
    }
    else if(scene.playerAttacking){
        airPlayerAttacking(io, scene, prevVelocity);
    }
    else if(scene.playerWallSliding){
        playerWallSliding(io, scene);
    }
    else{
        if(prevVelocity.y >= 0){ // player moving down
            //console.log('checking if we can still do a wall jump');
            const buffer = 20; // how far we can be from the wall and still do a wall jump
            const withinWallJumpRange = scene.x > scene.stopWallSlidingPosition.x - buffer && scene.x < scene.stopWallSlidingPosition.x + buffer;
            //console.log('withinWallJumpRange:', withinWallJumpRange);
            const validJump = scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime;
            //console.log('validJump:', validJump);
            //const canWallSlideAgain = scene.x===scene.stopWallSlidingPosition.x;

            if(withinWallJumpRange && validJump && scene.stopWallSlidingDirection===scene.currentPlayerDirection){
                let animationName = '';
                
                switch(scene.equippedWeapon){
                    case 'glove': {animationName = 'jumpGlove'; break;}
                    case 'bow': {animationName = 'jumpBowDrawn'; break;}
                    case 'none': {animationName = 'jump'; break;}
                    case 'sword': {animationName = 'jumpSwordDrawn'; break;}
                }
                setNewCharacterAnimation(io, io, scene, animationName, scene.currentPlayerDirection==='left', false); 
                
                const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                //scene.player.setPosition(scene.player.body.position.x + (-1*factor*100), scene.player.body.position.y);

                const jumpX = factor*scene.playerSpeed;
                const jumpY = scene.playerIceWallSliding ? scene.playerIceJumpHeight : scene.playerWallJumpHeight;
                scene.vx = jumpX;
                scene.vy = jumpY;

                scene.playerCanJump = false;        
                scene.playerWallSliding = false;   
                scene.playerWallJumping = true;  
                // scene.wallJumpOffPosition = {...scene.playerBody.position};
                scene.wallJumpOffPosition = {x: scene.x, y: scene.y};  
                scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;

                console.log('set player to wall jump from fall next to wall');
                               
            }
            else if(scene.currentPlayerAnimation!=='fall' && scene.currentPlayerAnimation!=='fallSword' && scene.currentPlayerAnimation!=='fallSwordDrawn' && scene.currentPlayerAnimation!=='fallBowDrawn' && scene.currentPlayerAnimation!=='fallGlove'){
                let animationName = '';
                // console.log('setting fall animation');
                // console.log(scene.equippedWeapon);
                switch(scene.equippedWeapon){
                    case 'glove': {animationName = 'fallGlove'; break;}
                    case 'bow': {animationName = 'fallBowDrawn'; break;}
                    case 'none': {animationName = 'fall'; break;}
                    case 'sword': {animationName = 'fallSwordDrawn'; break;}
                }
                scene.playerFriction = 0;
                setNewCharacterAnimation(io, scene, animationName, scene.currentPlayerDirection==='left', false);
            }
            else if (scene.controlConfig.leftControl.isDown && scene.controlConfig.rightControl.isUp)
            {
                //console.log('checking if player can start wall sliding again at position:', this.playerBody.position);
                //if(scene.playerBody.position.x===scene.stopWallSlidingPosition.x &&
                if(scene.x===scene.stopWallSlidingPosition.x && scene.stopWallSlidingDirection==='left'){
                        //console.log('resetting wall slide to left wall');
                        scene.playerWallSliding = true;
                }
                else if(scene.currentPlayerDirection!=='left'){
                    //if(scene.currentPlayerAnimation!=='fall' && scene.currentPlayerAnimation!=='fallSword' && scene.currentPlayerAnimation!=='fallSwordDrawn' && scene.currentPlayerAnimation!=='fallbowDrawn'){
                        let animationName = '';
                        // console.log('setting fall animation');
                        // console.log(scene.equippedWeapon);
                        switch(scene.equippedWeapon){
                            case 'glove': {animationName = 'fallGlove'; break;}
                            case 'bow': {animationName = 'fallBowDrawn'; break;}
                            case 'none': {animationName = 'fall'; break;}
                            case 'sword': {animationName = 'fallSwordDrawn'; break;}
                        }
                        scene.playerFriction = 0;
                        setNewCharacterAnimation(io, scene, animationName, true, false);
                   // }
                }
            }
            else if (scene.controlConfig.rightControl.isDown && scene.controlConfig.leftControl.isUp)
            {
                //console.log('checking if player can start wall sliding again at position:');
                if(scene.x===scene.stopWallSlidingPosition.x && scene.stopWallSlidingDirection==='right'){
                        //console.log('resetting wall slide to right wall');
                        scene.playerWallSliding = true;
                 }

                else if(scene.currentPlayerDirection!=='right'){
                        let animationName = '';
                        // console.log('setting fall animation');
                        // console.log(scene.equippedWeapon);
                        switch(scene.equippedWeapon){
                            case 'glove': {animationName = 'fallGlove'; break;}
                            case 'bow': {animationName = 'fallBowDrawn'; break;}
                            case 'none': {animationName = 'fall'; break;}
                            case 'sword': {animationName = 'fallSwordDrawn'; break;}
                        }
                        scene.playerFriction = 0;
                        setNewCharacterAnimation(io, scene, animationName, false, false);
                }
            }

        }
        else{// player is still moving up
            if (scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection!=='right'){
                scene.currentPlayerDirection = 'right';
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, false, false);        
            }       
            else if (scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection!=='left'){
                scene.currentPlayerDirection = 'left';
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, true, false);
            }    
        }
    }
    setAirVelocity(scene, prevVelocity);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
const playerWallSliding = (io, scene) => {
        //start wallsliding
        if(Date.now() - scene.prevJumpTime < scene.noFrictionWindow){
            scene.playerFriction = 0;
        }
        else{
            scene.playerFriction = 0.3;
        }

        //console.log('checking if we should change player animation to wall slide')
        if((scene.currentPlayerAnimation!=='wallSlideSwordDrawn' && scene.currentPlayerAnimation!=='wallSlideBowDrawn' && scene.currentPlayerAnimation!=='wallSlideGlove') || scene.resetWallSlide){
            //console.log('changing to wall slide animation');
            
            let animation = '';
            switch(scene.equippedWeapon){
                case 'glove': {animation = 'wallSlideGlove'; break;}
                case 'bow': {animation = 'wallSlideBowDrawn'; break;}
                case 'none': {animation = 'wallSlide'; break;}
                case 'sword': {animation = 'wallSlideSwordDrawn'; break;}
            }
            setNewCharacterAnimation(io, scene, animation, scene.lastWallCollisionDirection==='left', false);
        }

        //jump off the wall
        if(scene.controlConfig.jumpControl.isDown && scene.controlConfig.jumpControl.timeDown > scene.prevJumpTime){
            //console.log('jump off wall');
            //flip the players direction cause they were facing the opposite way when on the wall
            scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
            //const animationName = scene.swordDrawn ? 'jumpSword' : 'jump';
            let animation = '';
            switch(scene.equippedWeapon){
                case 'glove': {animation = 'jumpGlove'; break;}
                case 'bow': {animation = 'jumpBowDrawn'; break;}
                case 'none': {animation = 'jump'; break;}
                case 'sword': {animation = 'jumpSwordDrawn'; break;}
            }
            scene.stopWallSlidingPosition = {x: scene.x, y: scene.y};
            setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
            //console.log('player direction at tiem of wall jump:', scene.currentPlayerDirection);

            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            const jumpX = factor*scene.playerSpeed;
            const jumpY = scene.playerIceWallSliding ? scene.playerIceJumpHeight : scene.playerWallJumpHeight;
            scene.vx = jumpX;
            scene.vy = jumpY;
            //console.log('player velocity:', jumpX, jumpY);
            
            scene.playerCanJump = false;        
            scene.playerWallSliding = false;
            scene.playerIceWallSliding = false;   
            scene.playerWallJumping = true;  
            // scene.wallJumpOffPosition = {...scene.playerBody.position};
            scene.wallJumpOffPosition = {x: scene.x, y: scene.y};  
            scene.prevJumpTime = scene.controlConfig.jumpControl.timeDown;
            //console.log('jujst set player wall jump position as:', this.wallJumpOffPosition);
            scene.stopWallSlidingDirection = scene.currentPlayerDirection;
            scene.inContactWithWall = false;
        }
        else{//check if we should stop wall sliding
            if(scene.controlConfig.rightControl.isDown  && scene.controlConfig.leftControl.isUp && scene.currentPlayerDirection!=='right' ||
                scene.controlConfig.leftControl.isDown  && scene.controlConfig.rightControl.isUp && scene.currentPlayerDirection!=='left'){
                   console.log('stopping wall slide');
                   scene.playerFriction = 0;
                   //flip the players direction cause they were facing the opposite way when on the wall
                   
                   scene.currentPlayerDirection = scene.currentPlayerDirection==='left' ? 'right' : 'left';
                   scene.stopWallSlidingDirection = scene.currentPlayerDirection;
                   
                   //console.log('checking if player can start wall sliding again at position:');
                   scene.stopWallSlidingPosition = {x: scene.x, y: scene.y}; 
                   //const animationName = scene.swordDrawn ? 'fallSword' : 'fall';
                   let animation = '';
                   switch(scene.equippedWeapon){
                    case 'glove': {animation = 'fallGlove'; break;}
                       case 'bow': {animation = 'fallBowDrawn'; break;}
                       case 'none': {animation = 'fall'; break;}
                       case 'sword': {animation = 'fallSwordDrawn'; break;}
                   }
                   setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
                   scene.playerWallSliding = false;
                   scene.playerIceWallSliding = false;
               }
        }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
const airPlayerAttacking = (io, scene, prevVelocity) => {
    if(scene.equippedWeapon==='sword'){
        if(scene.downAttack){
            if(scene.currentPlayerAnimation !== 'airSwing3Start' && scene.currentPlayerAnimation !== 'airSwing3Loop' && scene.currentPlayerAnimation !== 'airSwing3End'){
                //console.log('setting animation to downward airAttack');
                setNewCharacterAnimation(io, scene, 'airSwing3Start', scene.currentPlayerDirection==='left', false);
                
            }
        }
        else if(scene.playerWallSliding){
            if(scene.currentPlayerAnimation !== 'wallSwing'){
                scene.stopWallSlidingPosition = {x: scene.x, y: scene.y};
                setNewCharacterAnimation(io, scene, 'wallSwing', scene.currentPlayerDirection==='left', false);
                //scene.stamina -= scene.attackStaminaPenalty;
                scene.lastAttackTime = Date.now();
            }
        }
        else if((scene.currentPlayerAnimation !== 'airSwing1' && scene.currentPlayerAnimation !== 'airSwing2') && Date.now() - scene.lastAttackTime > 500){
            //console.log('setting animation to airSwing');
            let swing = '';
            if(!scene.heavyAttack){
                swing = 'airSwing2'; 
                scene.prevSwordSwing = 'airSwing2';
            }
            else{
                swing = 'airSwing1'; 
                scene.prevSwordSwing = 'airSwing1';
                scene.heavyAttack = false;
            }
            setNewCharacterAnimation(io, scene, swing, scene.currentPlayerDirection==='left', false);
            scene.lastAttackTime = Date.now(); 
            //scene.stamina -= scene.attackStaminaPenalty;
        }
    }
    else if(scene.equippedWeapon==='bow'){
        if(scene.currentPlayerAnimation==='jumpHoldLoop' || scene.currentPlayerAnimation==='fallHoldLoop'){
            if(scene.bowRelease){
                let animation = '';
                switch(scene.currentPlayerAnimation){
                    case 'jumpHoldLoop': { animation = 'jumpRelease'; break; }
                    case 'fallHoldLoop': { animation = 'fallRelease'; break; }
                }
                setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
            }
            else if(scene.currentPlayerAnimation==='jumpHoldLoop' && prevVelocity.y >= 0){
                setNewCharacterAnimation(io, scene, 'fallHoldLoop', scene.currentPlayerDirection==='left', false);
            }
            else{
                if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
                    setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, true, false);
                }
                else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
                    setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, false, false);
                }
            }
        }
        else if(scene.currentPlayerAnimation==='jumpNotch' || scene.currentPlayerAnimation==='fallNotch'){
            if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, true, false);
            }
            else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, false, false);
            }              
        }
        else if(scene.currentPlayerAnimation==='jumpRelease' || scene.currentPlayerAnimation==='fallRelease'){
            if(scene.controlConfig.leftControl.isDown && scene.currentPlayerDirection==='right'){
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, true, false);
            }
            else if(scene.controlConfig.rightControl.isDown && scene.currentPlayerDirection==='left'){
                setNewCharacterAnimation(io, scene, scene.currentPlayerAnimation, false, false);
            }             
        }
        else if(!scene.bowAttacks.includes(scene.currentPlayerAnimation)){
            let animation = '';
            switch(scene.currentPlayerAnimation){
                case 'jumpBowDrawn': { animation = 'jumpNotch'; break; }
                case 'fallBowDrawn': { animation = 'fallNotch'; break; }
            }
            setNewCharacterAnimation(io, scene, animation, scene.currentPlayerDirection==='left', false);
        }
        else if(scene.currentPlayerAnimation==='runHoldLoop'){
            setNewCharacterAnimation(io, scene, 'fallHoldLoop', scene.currentPlayerDirection==='left', false);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
const setAirVelocity = (scene, prevVelocity) => {
    //set the characters speed depending on the active animation and active direction
    switch(scene.currentPlayerAnimation){
        case 'wallSlideSwordDrawn':
        case 'wallSlideBowDrawn':
        case 'wallSwing':
        case 'wallSlideGlove':
        case 'wallSlide': {
            const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
            //scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*0.3, prevVelocity.y);
            break;
        }
        case 'ledgeGrab':
        case 'ledgeGrabGlove':
        case 'ledgeGrabSwordDrawn':
        case 'ledgeGrabBowDrawn': {
            scene.vx = 0;
            scene.vy = 0;
            break;
        }
        case 'airSwing3Start':
        case 'airSwing3Loop': {
            scene.vx = 0;
            scene.vy = scene.playerMaxSpeed;
            break;
        }
        case 'fallHoldLoop': {
            if(scene.inContactWithWall){
                scene.vx = 0;
                scene.vy = prevVelocity.y;
                break;
            }
        }
       // case 'jumpGlove':
        case 'jumpCastRed':
        case 'jumpCastBlue':{
            if(['wallSlideCastRed', 'wallSlideCastBlue', 'fallCastRed', 'fallCastBlue'].includes(scene.prevPlayerAnimation)){
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
            if(scene.currentPlayerDirection==='right' && scene.controlConfig.rightControl.isDown){
                scene.vx = scene.playerSpeed;
                scene.vy = prevVelocity.y;
                break;
            }
            else if(scene.currentPlayerDirection==='left' && scene.controlConfig.leftControl.isDown){
                scene.vx = -1*scene.playerSpeed;
                scene.vy = prevVelocity.y;
                break;
            }
            else{
                scene.vx = 0;
                scene.vy = prevVelocity.y;
                break;
            }
        } 
        case 'jumpSwordDrawn':
        case 'jumpBowDrawn':
        case 'jumpGlove':
        case 'jump': {
            if(!scene.playerLedgeClimb){
                if(scene.controlConfig.rightControl.isDown && !scene.playerWallJumping){
                    scene.vx = scene.playerSpeed;
                    scene.vy = prevVelocity.y;
                    break;
                }
                else if(scene.controlConfig.leftControl.isDown && !scene.playerWallJumping){
                    scene.vx = -1*scene.playerSpeed;
                    scene.vy = prevVelocity.y;
                    break;
                }
                else if(scene.playerWallJumping){
                    const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                    //scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*scene.playerSpeed, -2.5*scene.playerSpeed); 
                }
                else if(scene.controlConfig.leftControl.isUp && scene.controlConfig.rightControl.isUp){
                    scene.vx = 0;
                    scene.vy = prevVelocity.y;
                    break;
                }
            }
        }
        default: break;
    }
}

const setNewCharacterAnimation = (io, scene, animationName, flipX, flipY, startFrameIndex = 0, interrupt = true) => {


    if(animationName !== scene.currentPlayerAnimation || scene.currentPlayerDirection==='left' && !flipX || scene.currentPlayerDirection==='right' && flipX){
        io.to(scene.playerId).emit('opponentAnimationUpdate', {
            currentAnimation: animationName,
            flipX: flipX,
            playerFriction: scene.playerFriction
        });

        scene.prevPlayerAnimation = scene.currentPlayerAnimation;
        scene.currentPlayerAnimation = animationName;
    
        scene.prevPlayerDirection = scene.currentPlayerDirection;
        scene.currentPlayerDirection = flipX ? 'left' : 'right';

        // if(scene.swordAttacks.includes(scene.prevPlayerAnimation)){
        //     scene.playerAttacking = false;
        // }

    }

}


exports.movementUpdate = movementUpdate;