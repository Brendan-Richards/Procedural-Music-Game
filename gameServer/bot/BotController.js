const movementUpdate = require('./BotMovement').movementUpdate;


const updateBot = (bot, io, px, py, bx, by, bvx, bvy) => {

    const attackDistance = 20;
    const minTimeBetweenAttacks = 250;

    //const bot = players[player].bot;
    bot.x = bx;
    bot.y = by;
    bot.vx = bvx;
    bot.vy = bvy;


    const distance = Math.sqrt(Math.pow(Math.abs(bx - px), 2) + Math.pow(Math.abs(by - py), 2));
    const offset = Math.random() * 10;
    const prob = 0.2;

    if(bot.playerWallSliding){
        if(Date.now() - bot.controlConfig.jumpControl.timeDown > 100){
            bot.controlConfig.jumpControl.timeDown = Date.now();
            bot.controlConfig.jumpControl.isDown = true;
            bot.controlConfig.jumpControl.isUp = false;
        }
        else{
            bot.controlConfig.jumpControl.isDown = false;
            bot.controlConfig.jumpControl.isUp = true;                
        }
        
        if(bot.lastWallCollisionDirection==='left'){
            left(bot);
        }
        else{
            right(bot);               
        }
    }
    else if(!bot.attackPause && distance - offset < attackDistance && Date.now() - bot.lastAttackTime > minTimeBetweenAttacks){
        
        if(Math.random() < prob){
            bot.attackPause = true;
            bot.attackPauseTime = Date.now();
        }
        else{
            bot.controlConfig.attack.isDown = true;
            bot.controlConfig.attack.isUp = false;
            bot.playerAttacking = true;
            setTimeout(() => {
                bot.playerAttacking = false;
                bot.controlConfig.attack.isDown = false;
                bot.controlConfig.attack.isUp = true;
            }, minTimeBetweenAttacks);
        }

    }
    else if(bx > px){
        bot.attackPause ? right(bot) : left(bot);
    }
    else{
        bot.attackPause ? left(bot) : right(bot);   
    }
    
    if(bot.attackPause && Date.now() - bot.attackPauseTime > bot.minAttackPause){
        bot.attackPause = false;
    }

    if(Date.now() - bot.positionSaveTime > 1000){

        if(bot.x===bot.positionSave.x && bot.y===bot.positionSave.y){
            bot.controlConfig.jumpControl.timeDown = Date.now();
            bot.controlConfig.jumpControl.isDown = true;
            bot.controlConfig.jumpControl.isUp = false;
            bot.attackPause = true;
            bot.attackPauseTime = Date.now();
        }

        bot.positionSaveTime = Date.now();
        bot.positionSave = {x: bot.x, y: bot.y};

        //scene.playerFriction = 0;
    }

    if(Math.random() > 0.99){
        bot.controlConfig.jumpControl.timeDown = Date.now();
        bot.controlConfig.jumpControl.isDown = true;
        bot.controlConfig.jumpControl.isUp = false;
    }

    movementUpdate(bot, io);
    io.to(bot.playerId).emit('botMovementUpdate', {
        vx: bot.vx,
        vy: bot.vy
    });

    bot.lastUpdateTime = Date.now();

};

const left = bot => {
    bot.controlConfig.leftControl.isDown = true;
    bot.controlConfig.leftControl.isUp = false;
    bot.controlConfig.rightControl.isDown = false;
    bot.controlConfig.rightControl.isUp = true;
}

const right = bot => {
    bot.controlConfig.leftControl.isDown = false;
    bot.controlConfig.leftControl.isUp = true;
    bot.controlConfig.rightControl.isDown = true;
    bot.controlConfig.rightControl.isUp = false;     
}

const botWallCollision = (bot, data) => {

    bot.inContactWithWall = true;
    bot.lastWallCollision = Date.now();

    bot.lastWallCollisionDirection = data.lastWallCollisionDirection;
    //console.log('setting last wall collision direction:', bot.lastWallCollisionDirection);

    const both = bot.inContactWithWall && bot.inContactWithGround;

    if(!bot.playerCanJump && bot.vy < 0 || both && !bot.playerCanJump){
        bot.vxs = 0;
        bot.vy = -10;
    }

    if(!bot.playerLedgeGrab && !bot.playerLedgeClimb){
        bot.inContactWithWall = true;
        bot.wallCollisionDirection = bot.currentPlayerDirection==='left' ? 'left' : 'right';

        if(bot.currentPlayerAnimation==='idleSwing1' || bot.currentPlayerAnimation==='idleSwing2' || bot.currentPlayerAnimation==='runSwing' ||
        bot.currentPlayerAnimation==='airSwing1' || bot.currentPlayerAnimation==='airSwing2'){
            if(!bot.swordCollided){
                //scene.audio.swordSwingSound.sound.stop();
                //scene.socket.emit('playerSoundStop', ['swordSwingSound']);
                //scene.audio.swordRockImpact.sound.play(scene.audio.swordRockImpact.config);
                //scene.socket.emit('playerSound', {name: 'swordRockImpact', x: scene.player.x, y: scene.player.y});
                const factor = bot.currentPlayerDirection==='left' ? 1 : -1;
                bot.vx = factor * bot.playerSpeed;
                //scene.player.setVelocityX(factor * scene.playerSpeed);
                bot.swordCollided = true;
            }

        }
        else{

            //console.log('collided with wall');
            bot.playerFriction = 0;
            
            bot.resetWallSlide = false;
           
            bot.playerIceWallSliding = false;
            
            bot.playerWallSliding = true;
            bot.playerAttacking = false;
            bot.playerWallJumping = false;
            bot.playerCanJump = true;
            bot.playerRampSliding = false;
            bot.playerFlatSliding = false;
        }
    }

    ///////////////////////////////////////////////

    // bot.playerWallSliding = true;
    // bot.playerCanJump = true;
    // bot.lastWallCollisionDirection = players[socket.id].bot.currentPlayerDirection;
}


const botGroundCollision = (bot) => {
    const both = bot.inContactWithWall && bot.inContactWithGround;

    if(!both){
        //console.log('collided with top of terrain');
        //console.log('wall top collision time:', scene.time.now);
        bot.lastGroundCollision = Date.now();
        //scene.inContactWithWall = false;
        bot.inContactWithGround = true;
        bot.playerCanJump = true;

        // if(bot.currentPlayerAnimation==='airSwing3Loop'){

        //     let suffix = '';

        //     switch(scene.playerHealth){
        //         case 100: {suffix = '100'; break;}
        //         case 75: {suffix = '075'; break;}
        //         case 50: {suffix = '050'; break;}
        //         case 25: {suffix = '025'; break;}
        //         case 0: {suffix = '000'; break;}
        //     }

        //     scene.player.play('airSwing3End' + suffix, true);
        //     scene.prevPlayerAnimation = 'airSwing3Loop';
        //     scene.currentPlayerAnimation = 'airSwing3End';
        //     emitAnimationEvent(scene, 'airSwing3End', scene.currentPlayerDirection==='left');
        // }
        // else if(scene.currentPlayerAnimation==='airSwing3End'){
        //     scene.playerCanJump = false;
        // }
       // else{

            const currentTime = Date.now();
            if(!bot.playerCanJump && currentTime - bot.lastLandingTime > 100){// if player is colliding with ground from mid air
                //if(currentTime - scene.playerLastOnGroundTime > 2000){
                // if(scene.playerBody.velocity.y > 10){
                    //console.log('playing hard landing');
                    //scene.audio.hardLanding.sound.play(scene.audio.hardLanding.config);
                    //scene.socket.emit('playerSound', {name: 'hardLanding', x: scene.player.x, y: scene.player.y});
                // }
                // else{
                    //console.log('playing soft landing');
                    //scene.audio.jumpSound.play(scene.audio.jumpConfig);                                
                // }

            }
            bot.lastLandingTime = currentTime;
            bot.playerLastOnGroundTime = currentTime;
            bot.playerCanJump = true;
            bot.playerWallSliding = false;
       // }
    }

}


exports.updateBot = updateBot;
exports.botWallCollision = botWallCollision;
exports.botGroundCollision = botGroundCollision;