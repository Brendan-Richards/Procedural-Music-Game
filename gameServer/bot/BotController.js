const movementUpdate = require('./BotMovement').movementUpdate;


const updateBot = (bot, io, px, py, bx, by, bvx, bvy) => {

    const attackDistance = 30;
    const minTimeBetweenAttacks = 300;

    //const bot = players[player].bot;
    bot.x = bx;
    bot.y = by;
    bot.vx = bvx;
    bot.vy = bvy;

    const distance = Math.sqrt(Math.pow(Math.abs(bx - px), 2) + Math.pow(Math.abs(by - py), 2));
    // if(distance < attackDistance && Date.now() - bot.lastAttackTime > minTimeBetweenAttacks){
        
    //     //make bot attack ( make bot click)
    //     console.log('making bot attack');
    //     bot.controlConfig.attack.isDown = true;
    //     bot.controlConfig.attack.isUp = false;
    //     bot.playerAttacking = true;
    //     setTimeout(() => {
    //         bot.playerAttacking = false;
    //         bot.controlConfig.attack.isDown = false;
    //         bot.controlConfig.attack.isUp = true;
    //     }, minTimeBetweenAttacks);
    // }
    // else if(bx > px){
    //     bot.controlConfig.leftControl.isDown = true;
    //     bot.controlConfig.leftControl.isUp = false;
    //     bot.controlConfig.rightControl.isDown = false;
    //     bot.controlConfig.rightControl.isUp = true;
    // }
    // else{
    //     bot.controlConfig.leftControl.isDown = false;
    //     bot.controlConfig.leftControl.isUp = true;
    //     bot.controlConfig.rightControl.isDown = true;
    //     bot.controlConfig.rightControl.isUp = false;     
    // }

    movementUpdate(bot, io);

    io.to(bot.playerId).emit('botMovementUpdate', {
        vx: bot.vx,
        vy: bot.vy
    });

};

exports.updateBot = updateBot;