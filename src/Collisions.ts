//import Phaser from 'phaser';
import MountainScene from './MountainScene';

const emitAnimationEvent = (scene: MountainScene, animationName: string, flipX: boolean) => {
    scene.socket.emit('playerNewAnimation', {
        animation: animationName, 
        flipX: flipX, 
        friction: scene.playerFriction
    });
}

const opponentTerrainCollision = (scene: MountainScene, opponent, terrain, collisionNormal, collisionPoint) => {
    if(scene.botMatch){
        if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
            //console.log('collided with top of terrain');
            scene.socket.emit('botGroundCollision');
        }
        else{//console.log('collided with side of terrain');
            scene.socket.emit('botWallCollision', {
                lastWallCollisionDirection: collisionPoint.x > scene.opponent.x ? 'right' : 'left'
            });    
        }
    }
};

const playerTerrainCollision = (scene: MountainScene, player, terrain, collisionNormal, collisionPoint) => {
    //console.log(collisionNormal);

    if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
        const both = scene.inContactWithWall && scene.inContactWithGround;

        if(!both){
            //console.log('collided with top of terrain');
            //console.log('wall top collision time:', scene.time.now);
            scene.lastGroundCollision = scene.time.now;
            //scene.inContactWithWall = false;
            scene.inContactWithGround = true;
            scene.playerCanJump = true;

            // const validContactTime = scene.lastWallCollision === scene.lastGroundCollision;
            // if(validContactTime){
            //     scene.player.setVelocity(0, -8);
            // }

            if(scene.currentPlayerAnimation==='airSwing3Loop'){

                let suffix = '';

                switch(scene.playerHealth){
                    case 100: {suffix = '100'; break;}
                    case 75: {suffix = '075'; break;}
                    case 50: {suffix = '050'; break;}
                    case 25: {suffix = '025'; break;}
                    case 0: {suffix = '000'; break;}
                }

                scene.player.play('airSwing3End' + suffix, true);
                scene.prevPlayerAnimation = 'airSwing3Loop';
                scene.currentPlayerAnimation = 'airSwing3End';
                emitAnimationEvent(scene, 'airSwing3End', scene.currentPlayerDirection==='left');
            }
            else if(scene.currentPlayerAnimation==='airSwing3End'){
                scene.playerCanJump = false;
            }
            else{
                // if(scene.losingStamina){
                //     scene.losingStamina = false;
                //     scene.gainingStamina = true;
                // }

                const currentTime = scene.time.now;
                if(!scene.playerCanJump && currentTime - scene.lastLandingTime > 100){// if player is colliding with ground from mid air
                    //if(currentTime - scene.playerLastOnGroundTime > 2000){
                    // if(scene.playerBody.velocity.y > 10){
                        //console.log('playing hard landing');
                        scene.audio.hardLanding.sound.play(scene.audio.hardLanding.config);
                        scene.socket.emit('playerSound', {name: 'hardLanding', x: scene.player.x, y: scene.player.y});
                    // }
                    // else{
                        //console.log('playing soft landing');
                        //scene.audio.jumpSound.play(scene.audio.jumpConfig);                                
                    // }

                }
                scene.lastLandingTime = currentTime;
                scene.playerLastOnGroundTime = scene.time.now;
                scene.playerCanJump = true;
                scene.playerWallSliding = false;
                if(scene.playerRampSliding){
                    scene.playerFlatSliding = true;
                    scene.playerRampSliding = false;
                    scene.setFlatSlide = false;
                } 
            }
        }

    }
    //else if(Math.abs(Math.round(collisionNormal.x))===1 && Math.abs(Math.round(collisionNormal.y))===0){
    else{
        //console.log('collided with side of terrain');
        //console.log('wall side collision time:', scene.time.now);
        scene.inContactWithWall = true;
        scene.lastWallCollision = scene.time.now;

        scene.lastWallCollisionDirection = collisionPoint.x > scene.player.x ? 'right' : 'left';

        const both = scene.inContactWithWall && scene.inContactWithGround;
        const validContactTime = scene.lastWallCollision === scene.lastGroundCollision;

        if(!scene.playerCanJump && scene.player.body.velocity.y < 0 || both && !scene.playerCanJump){
            //const timeSinceJump = scene.time.now - scene.playerLastOnGroundTime;
            //console.log('setting player velocity Y to -10');
            scene.player.setVelocity(0, -10);
        }
        // if(validContactTime){
        //     console.log('setting really high velocity');
        //     // scene.player.setPosition(scene.player.body.position.x, scene.player.body.position.y - 100);
        //     scene.player.setVelocityY(-12);
        // }

        if(!scene.playerLedgeGrab && !scene.playerLedgeClimb){
            scene.inContactWithWall = true;
            scene.wallCollisionDirection = scene.currentPlayerDirection==='left' ? 'left' : 'right';

            if(scene.currentPlayerAnimation==='idleSwing1' || scene.currentPlayerAnimation==='idleSwing2' || scene.currentPlayerAnimation==='runSwing' ||
                scene.currentPlayerAnimation==='airSwing1' || scene.currentPlayerAnimation==='airSwing2'){
                if(!scene.swordCollided){
                    scene.audio.swordSwingSound.sound.stop();
                    scene.socket.emit('playerSoundStop', ['swordSwingSound']);
                    scene.audio.swordRockImpact.sound.play(scene.audio.swordRockImpact.config);
                    scene.socket.emit('playerSound', {name: 'swordRockImpact', x: scene.player.x, y: scene.player.y});
                    const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                    scene.player.setVelocityX(factor * scene.playerSpeed);
                    scene.swordCollided = true;
                }

            }
            else{
  
                //console.log('collided with wall');
                scene.playerFriction = 0;
                
                scene.resetWallSlide = false;
               
                scene.playerIceWallSliding = false;
                
                scene.playerWallSliding = true;
                scene.playerAttacking = false;
                scene.playerWallJumping = false;
                //scene.playerCanJump = true;
                scene.playerRampSliding = false;
                scene.playerFlatSliding = false;
            }
        }
    }
};

const playerOpponentBoxCollision = (scene: MountainScene, player, opponentBox) => {
    //console.log('player collided with opponent attack box');
    //other =  bodyA===scene.opponentAttackBox ? bodyA : bodyB;
    recoilPlayers(scene, false, true);

    if(!scene.bothAttacking && scene.time.now - scene.lastSwordDamageTime > 500){

        const facingEachother = scene.currentPlayerDirection==='left' && scene.currentOpponentDirection==='right' ||
                                scene.currentPlayerDirection==='right' && scene.currentOpponentDirection==='left';
        const bothHitboxes = scene.playerAttackBox && scene.opponentAttackBox;
        const closeEnough = scene.player.x + 30 > scene.opponent.x && scene.player.x - 30 < scene.opponent.x;
        const noDamage = facingEachother && bothHitboxes && closeEnough;

        if(!noDamage){
            //player should take damage
            const damageAmount = scene.swordDamageAmount;
            
            scene.audio.swordBodyImpact.sound.play(scene.audio.swordBodyImpact.config);
            scene.socket.emit('playerSound', {name: 'swordBodyImpact', x: scene.player.x, y: scene.player.y});
                
            scene.socket.emit('playerDamaged', {
                damageAmount: damageAmount, 
                x: scene.player.x, 
                y: scene.player.y,
                name: 'bloodOpponent'
            });

            scene.lastSwordDamageTime = scene.time.now;

            let suffix = '';

            switch(scene.playerHealth){
                case 100: {suffix = '100'; break;}
                case 75: {suffix = '075'; break;}
                case 50: {suffix = '050'; break;}
                case 25: {suffix = '025'; break;}
                case 0: {suffix = '000'; break;}
            }

            const blood = scene.add.sprite(scene.player.x, scene.player.y, 'blood' + suffix);

            blood.play('blood' + suffix);
            blood.once('animationcomplete', animation => {
                //console.log('finished blood animation');
                blood.destroy();
            });

            scene.playerHealth -= damageAmount;
            //scene.playerHealthBar.decrease(damageAmount);

            const currentFrameIndex = scene.player.anims.currentFrame.index - 1;

            let num = scene.playerHealth.toString();
            while(num.length < 3){
                num = '0' + num;
            }
        
            scene.player.play(scene.currentPlayerAnimation + num, true, currentFrameIndex);
            
            // scene.socket.emit('bloodAnimation', {
            //     x: scene.player.x,
            //     y: scene.player.y,
            //     name: 'bloodOpponent'
            // });
        }
    }
};

const playerOpponentArrowCollision = (scene: MountainScene, player, opponentArrow) => {
//if(!scene.swordAttacks.includes(scene.currentPlayerAnimation)){
    const damageAmount = scene.arrowDamageAmount;

    scene.socket.emit('playerDamaged', {
        damageAmount: damageAmount, 
        x: scene.player.x, 
        y: scene.player.y,
        name: 'bloodOpponent'
    });

    let suffix = '';

    switch(scene.playerHealth){
        case 100: {suffix = '100'; break;}
        case 75: {suffix = '075'; break;}
        case 50: {suffix = '050'; break;}
        case 25: {suffix = '025'; break;}
        case 0: {suffix = '000'; break;}
    }

    const blood = scene.add.sprite(scene.player.x, scene.player.y, 'blood' + suffix);

    blood.play('blood' + suffix);
    blood.once('animationcomplete', animation => {
        //console.log('finished blood animation');
        blood.destroy();
    });   

    scene.audio.arrowBodyImpact.sound.play(scene.audio.arrowBodyImpact.config);
    scene.socket.emit('playerSound', {name: 'arrowBodyImpact', x: scene.player.x, y: scene.player.y});
    //}
    //console.log('length of scene.opponent arrows', scene.opponentArrows.length);
    //console.log('about to search through opponent arrows array, opponentArrows:', scene.opponentArrows);
    const arrowIndex = scene.opponentArrows.findIndex(val => {
        //console.log('val:', val, 'opponentArrow:', opponentArrow);
        return val.body===opponentArrow;
    });

    //console.log('hit with arrow at opponent arrow list index', arrowIndex);
    //scene.opponentArrows.splice(arrowIndex, 1);
    if(arrowIndex !== -1){
        scene.opponentArrows[arrowIndex].destroy();
        scene.opponentArrows.splice(arrowIndex, 1);
    }

    scene.playerHealth -= damageAmount;
    //scene.playerHealthBar.decrease(damageAmount);

    const currentFrameIndex = scene.player.anims.currentFrame.index - 1;

    let num = scene.playerHealth.toString();
    while(num.length < 3){
        num = '0' + num;
    }

    scene.player.play(scene.currentPlayerAnimation + num, true, currentFrameIndex);
    //console.log('still have reference to arrow', opponnentArrow);
    //opponentArrow.destroy();
    // other.setCollisionGroup(-3);
    // scene.matter.add.constraint(scene.player, other, 20, 1);
    //scene.add.circle(collisionPoint.x, collisionPoint.y, 2, 0xff0000).setDepth(100); 
};

const playerOpponentMagicCollision = (scene: MountainScene, player, opponentMagic) => {
    
    //console.log('opponent magic:', opponentMagic);
    if(opponentMagic.gameObject){
        opponentMagic.gameObject.destroy();
        //scene.matter.world.remove(opponentMagic);
        //scene.socket.emit('explosion', {x: scene.player.x, y: scene.player.y, opponent: true});
        const ex = makeExplosion(scene, scene.player.x, scene.player.y, true, false);
        
        //ex.setCollisionGroup(scene.playerGroup);
        scene.matter.setVelocity(ex, scene.player.body.velocity.x, scene.player.body.velocity.y);
    
        //scene.socket.emit('makeExplosion', {});
        scene.socket.emit('playerDamaged', scene.magicDamageAmount);
        scene.playerHealth -= scene.magicDamageAmount;
        //scene.playerHealthBar.decrease(scene.magicDamageAmount);
    }

}

const opponentPlayerArrowCollision = (scene: MountainScene, opponent, playerArrow) => {

    if(scene.botMatch){
        ///////////////////////////////////
        const damageAmount = scene.arrowDamageAmount;

        let suffix = '';

        switch(scene.opponentHealth){
            case 100: {suffix = '100'; break;}
            case 75: {suffix = '075'; break;}
            case 50: {suffix = '050'; break;}
            case 25: {suffix = '025'; break;}
            case 0: {suffix = '000'; break;}
        }

        const blood = scene.add.sprite(scene.opponent.x, scene.opponent.y, 'bloodOpponent' + suffix);

        blood.play('bloodOpponent' + suffix);
        blood.once('animationcomplete', animation => {
            //console.log('finished blood animation');
            blood.destroy();
        });   

        scene.audio.arrowBodyImpact.sound.play(scene.audio.arrowBodyImpact.config);

        const arrowIndex = scene.playerArrows.findIndex(val => {
            return val.body===playerArrow;
        });

        if(arrowIndex !== -1){
            scene.playerArrows[arrowIndex].destroy();
            scene.playerArrows.splice(arrowIndex, 1);
        }

        scene.opponentHealth -= damageAmount;
        //scene.playerHealthBar.decrease(damageAmount);

        const currentFrameIndex = scene.opponent.anims.currentFrame.index - 1;

        let num = scene.opponentHealth.toString();
        while(num.length < 3){
            num = '0' + num;
        }

        scene.opponent.play(scene.currentOpponentAnimation + num, true, currentFrameIndex);

    }
    else{
        const arrowIndex = scene.playerArrows.findIndex(val => {
            return val.body===playerArrow;
        });
    
        if(arrowIndex !== -1){
            scene.playerArrows[arrowIndex].destroy();
            scene.playerArrows.splice(arrowIndex, 1);
        }
    }

}

const opponentPlayerBoxCollision = (scene: MountainScene, opponent, playerBox) => {
    recoilPlayers(scene, true, false);

    if(scene.botMatch){
        botSwordDamage(scene, opponent, playerBox);
    }
}

 const botSwordDamage = (scene: MountainScene, opponent, playerBox) => {

    if(!scene.bothAttacking && scene.time.now - scene.lastSwordDamageTime > 500){

        const facingEachother = scene.currentPlayerDirection==='left' && scene.currentOpponentDirection==='right' ||
                                scene.currentPlayerDirection==='right' && scene.currentOpponentDirection==='left';
        const bothHitboxes = scene.playerAttackBox && scene.opponentAttackBox;
        const closeEnough = scene.player.x + 30 > scene.opponent.x && scene.player.x - 30 < scene.opponent.x;
        const noDamage = facingEachother && bothHitboxes && closeEnough;

        if(!noDamage){
            //player should take damage
            const damageAmount = scene.swordDamageAmount;
            
            scene.audio.swordBodyImpact.sound.play(scene.audio.swordBodyImpact.config);
            scene.socket.emit('playerSound', {name: 'swordBodyImpact', x: scene.player.x, y: scene.player.y});
                
            // scene.socket.emit('playerDamaged', {
            //     damageAmount: damageAmount, 
            //     x: scene.player.x, 
            //     y: scene.player.y,
            //     name: 'bloodOpponent'
            // });

            scene.lastSwordDamageTime = scene.time.now;

            let suffix = '';

            switch(scene.opponentHealth){
                case 100: {suffix = '100'; break;}
                case 75: {suffix = '075'; break;}
                case 50: {suffix = '050'; break;}
                case 25: {suffix = '025'; break;}
                case 0: {suffix = '000'; break;}
            }

            const blood = scene.add.sprite(scene.opponent.x, scene.opponent.y, 'bloodOpponent' + suffix);

            blood.play('bloodOpponent' + suffix);
            blood.once('animationcomplete', animation => {
                //console.log('finished blood animation');
                blood.destroy();
            });

            scene.opponentHealth -= damageAmount;
            //scene.playerHealthBar.decrease(damageAmount);

            const currentFrameIndex = scene.opponent.anims.currentFrame.index - 1;

            let num = scene.opponentHealth.toString();
            while(num.length < 3){
                num = '0' + num;
            }
        
            scene.opponent.play(scene.currentOpponentAnimation + num, true, currentFrameIndex);
            
            // scene.socket.emit('bloodAnimation', {
            //     x: scene.player.x,
            //     y: scene.player.y,
            //     name: 'bloodOpponent'
            // });
        }    
    }
 }


const opponentPlayerMagicCollision = (scene: MountainScene, opponent, playerMagic) => {
    //console.log('opponent magic:', opponentMagic);
    if(playerMagic.gameObject){
        playerMagic.gameObject.destroy();
        //scene.matter.world.remove(opponentMagic);
        //scene.socket.emit('explosion', {x: scene.player.x, y: scene.player.y, opponent: false});
        const ex = makeExplosion(scene, scene.opponent.x, scene.opponent.y, false, false);
        
        //ex.setCollisionGroup(scene.playerGroup);
        scene.matter.setVelocity(ex, scene.opponent.body.velocity.x, scene.opponent.body.velocity.y);
        //ex.setIgnoreGravity(true);
    }
}

const opponentPlayerExplosionCollision = (scene: MountainScene, opponent, playerExplosion) => {
    // scene.socket.emit('playerDamaged', scene.magicDamageAmount);
    // scene.playerHealthBar.decrease(scene.magicDamageAmount);
    setCollisionMask(scene, playerExplosion.gameObject, ['terrain', 'player', 'playerBox', 'playerArrow', 'opponentArrow', 'opponent', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);
}

const playerOpponentExplosionCollision = (scene: MountainScene, player, opponentExplosion) => {
    scene.socket.emit('playerDamaged', scene.magicDamageAmount);
    scene.playerHealth -= scene.magicDamageAmount;
    //scene.playerHealthBar.decrease(scene.magicDamageAmount);
    setCollisionMask(scene, opponentExplosion.gameObject, ['terrain', 'player', 'playerBox', 'playerArrow', 'opponentArrow', 'opponent', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);
}

const worldBoundaryPlayerMagicCollision = (scene: MountainScene, worldBoundary, playerMagic, collisionPoint) => {
    if(playerMagic.gameObject){
        playerMagic.gameObject.destroy();
        makeExplosion(scene, collisionPoint.x, collisionPoint.y, false);
    }
}

const worldBoundaryOpponentMagicCollision = (scene: MountainScene, worldBoundary, opponentMagic, collisionPoint) => {
    if(opponentMagic.gameObject){
        opponentMagic.gameObject.destroy();
        makeExplosion(scene, collisionPoint.x, collisionPoint.y, true);
    }
}

const playerMagicTerrainCollision = (scene: MountainScene, playerMagic, terrain, collisionPoint) => {
    if(playerMagic.gameObject){
        playerMagic.gameObject.destroy();
        makeExplosion(scene, collisionPoint.x, collisionPoint.y, false);
    }
}

const opponentMagicTerrainCollision = (scene: MountainScene, opponentMagic, terrain, collisionPoint) => {
    if(opponentMagic.gameObject){
        opponentMagic.gameObject.destroy();
        makeExplosion(scene, collisionPoint.x, collisionPoint.y, true);
    }
}

const playerBoxOpponentArrowCollision = (scene: MountainScene, playerBox, opponentArrow) => {
    const arrowIndex = scene.opponentArrows.findIndex(val => {
        return val.body===opponentArrow;
    });

    if(arrowIndex !== -1){
        scene.opponentArrows.splice(arrowIndex, 1);
        // scene.playerArrows[arrowIndex].setAngularVelocity(Math.random() * 4 - 2);
        opponentArrow.gameObject.setAngularVelocity(Math.random() * 4 - 2);
        const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
        opponentArrow.gameObject.setVelocity(factor * 2, -2);

        setTimeout(() => {
            opponentArrow.gameObject.destroy();
        }, 3000)
    }
}


const playerArrowOpponentBoxCollision = (scene: MountainScene, playerArrow, opponentBox) => {
    const arrowIndex = scene.playerArrows.findIndex(val => {
        //console.log('val.body:', val.body, 'playerArrow:', playerArrow);
        return val.body===playerArrow;
    });

   // console.log('opponent attack box hit with arrow at player arrow list index', arrowIndex);

    if(arrowIndex !== -1){
        scene.playerArrows.splice(arrowIndex, 1);
        // scene.playerArrows[arrowIndex].setAngularVelocity(Math.random() * 4 - 2);
        playerArrow.gameObject.setAngularVelocity(Math.random() * 4 - 2);
        const factor = scene.currentOpponentDirection==='left' ? -1 : 1;
        playerArrow.gameObject.setVelocity(factor * 2, -2);

        setTimeout(() => {
            playerArrow.gameObject.destroy();
        }, 3000)
    }
}

const playerBoxOpponentBoxCollision = (scene: MountainScene, playerBox, opponentBox) => {
    scene.audio.swordSwordImpact.sound.play(scene.audio.swordSwordImpact.config);
    scene.socket.emit('playerSound', {name: 'swordSwordImpact', x: scene.player.x, y: scene.player.y});
    scene.bothAttacking = true;
    //console.log('setting both players attacking to true');
    scene.player.once('animationstart', () => {
        //console.log('setting both players attacking to false');
        scene.bothAttacking = false;
        if(scene.playerAttackBox){
            scene.matter.world.remove(scene.playerAttackBox);
            scene.playerAttackBox = null;
        }
        if(scene.opponentAttackBox){
            scene.matter.world.remove(scene.opponentAttackBox);
            scene.opponentAttackBox = null;
        }
        scene.socket.emit('removeAttackBoxes');
    });
    recoilPlayers(scene, true, true);
}

const opponentArrowTerrainCollision = (scene: MountainScene, opponentArrow, terrain) => {
    opponentArrow.parent.isStatic = true;
    opponentArrow.parent.collisionFilter.category = null;
}

const opponentArrowWorldBoundaryCollision = (scene: MountainScene, opponentArrow, worldBoundary) => {
    opponentArrow.parent.isStatic = true;
    opponentArrow.parent.collisionFilter.category = null;
}

const playerArrowTerrainCollision = (scene: MountainScene, playerArrow, terrain) => {
    //scene.matter.setVelocity(playerArrow.parent as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
    playerArrow.parent.isStatic = true;
    playerArrow.parent.collisionFilter.category = null;
}

const playerArrowWorldBoundaryCollision = (scene: MountainScene, playerArrow, worldBoundary) => {
    playerArrow.parent.isStatic = true;
    playerArrow.parent.collisionFilter.category = null;
}


const handleCollisions = (scene: MountainScene): void => {
    //collision between player, ground, and wall
    scene.matter.world.on("collisionstart", (event, body1, body2) => {

        event.pairs.forEach(pair => {
            //console.log(pair);
            const collisionNormal = pair.collision.normal;
            const collisionPoint = pair.collision.supports[0].contact.vertex;
            //console.log('collision happened');
            const { bodyA, bodyB } = pair;
            //console.log('pair:', pair);

            const labelA = pair.collision.parentA.label;
            const labelB = pair.collision.parentB.label;

            //console.log('collision between', labelA, 'and', labelB);
            //console.log(pair);

            if(labelA==='player' && labelB==='terrain' || labelB==='player' && labelA==='terrain' ||
                labelA==='player' && labelB==='worldBoundary' || labelB==='player' && labelA==='worldBoundary'){
                const player = labelA==='player' ? bodyA : bodyB;
                const terrain = labelA==='player' ? bodyB : bodyA;
                playerTerrainCollision(scene, player, terrain, collisionNormal, collisionPoint);
            }
            else if(labelA==='opponent' && labelB==='terrain' || labelB==='opponent' && labelA==='terrain' ||
            labelA==='opponent' && labelB==='worldBoundary' || labelB==='opponent' && labelA==='worldBoundary'){
                const opponent = labelA==='opponent' ? bodyA : bodyB;
                const terrain = labelA==='opponent' ? bodyB : bodyA;
                opponentTerrainCollision(scene, opponent, terrain, collisionNormal, collisionPoint);
            }
            else if(labelA==='player' && labelB==='opponentBox' || labelB==='player' && labelA==='opponentBox'){
                const player = labelA==='player' ? bodyA : bodyB;
                const opponnentBox = labelA==='player' ? bodyB : bodyA;
                playerOpponentBoxCollision(scene, player, opponnentBox);
            }
            else if(labelA==='player' && labelB==='opponentArrow' || labelB==='player' && labelA==='opponentArrow'){
                const player = labelA==='player' ? bodyA : bodyB;
                const opponnentArrow = labelA==='player' ? bodyB : bodyA;
                playerOpponentArrowCollision(scene, player, opponnentArrow);
            }
            else if(labelA==='player' && labelB==='opponentMagic' || labelB==='player' && labelA==='opponentMagic'){
                const player = labelA==='player' ? bodyA : bodyB;
                const opponnentMagic = labelA==='player' ? bodyB : bodyA;
                playerOpponentMagicCollision(scene, player, opponnentMagic);
            }
            else if(labelA==='player' && labelB==='opponentExplosion' || labelB==='player' && labelA==='opponentExplosion'){
                const player = labelA==='player' ? bodyA : bodyB;
                const opponnentExplosion = labelA==='player' ? bodyB : bodyA;
                playerOpponentExplosionCollision(scene, player, opponnentExplosion);
            }

            else if(labelA==='opponent' && labelB==='playerArrow' || labelB==='opponent' && labelA==='playerArrow'){
                const opponent = labelA==='opponent' ? bodyA : bodyB;
                const playerArrow = labelA==='opponent' ? bodyB : bodyA;
                opponentPlayerArrowCollision(scene, opponent, playerArrow);
            }
            else if(labelA==='opponent' && labelB==='playerBox' || labelB==='opponent' && labelA==='playerBox'){
                const opponent = labelA==='opponent' ? bodyA : bodyB;
                const playerBox = labelA==='opponent' ? bodyB : bodyA;
                opponentPlayerBoxCollision(scene, opponent, playerBox);
            }
            else if(labelA==='opponent' && labelB==='playerMagic' || labelB==='opponent' && labelA==='playerMagic'){
                const opponent = labelA==='opponent' ? bodyA : bodyB;
                const playerMagic = labelA==='opponent' ? bodyB : bodyA;
                opponentPlayerMagicCollision(scene, opponent, playerMagic);
            }
            else if(labelA==='opponent' && labelB==='playerExplosion' || labelB==='opponent' && labelA==='playerExplosion'){
                const opponent = labelA==='opponent' ? bodyA : bodyB;
                const playerExplosion = labelA==='opponent' ? bodyB : bodyA;
                opponentPlayerExplosionCollision(scene, opponent, playerExplosion);
            }

            else if(labelA==='playerMagic' && labelB==='terrain' || labelB==='playerMagic' && labelA==='terrain'){
                const playerMagic = labelA==='playerMagic' ? bodyA : bodyB;
                const terrain = labelA==='playerMagic' ? bodyB : bodyA;
                playerMagicTerrainCollision(scene, playerMagic, terrain, collisionPoint);
            }
            else if(labelA==='opponentMagic' && labelB==='terrain' || labelB==='opponentMagic' && labelA==='terrain'){
                const opponentMagic = labelA==='opponentMagic' ? bodyA : bodyB;
                const terrain = labelA==='opponentMagic' ? bodyB : bodyA;
                opponentMagicTerrainCollision(scene, opponentMagic, terrain, collisionPoint);
            }

            else if(labelA==='playerBox' && labelB==='opponentArrow' || labelB==='playerBox' && labelA==='opponentArrow'){
                const playerBox = labelA==='playerBox' ? bodyA : bodyB;
                const opponentArrow = labelA==='playerBox' ? bodyB : bodyA;
                playerBoxOpponentArrowCollision(scene, playerBox, opponentArrow);
            }
            else if(labelA==='playerArrow' && labelB==='opponentBox' || labelB==='playerArrow' && labelA==='opponentBox'){
                const playerArrow = labelA==='playerArrow' ? bodyA : bodyB;
                const opponentBox = labelA==='playerArrow' ? bodyB : bodyA;
                playerArrowOpponentBoxCollision(scene, playerArrow, opponentBox);
            }

            else if(labelA==='worldBoundary' && labelB==='playerMagic' || labelB==='worldBoundary' && labelA==='playerMagic'){
                const worldBoundary = labelA==='worldBoundary' ? bodyA : bodyB;
                const playerMagic = labelA==='worldBoundary' ? bodyB : bodyA;
                worldBoundaryPlayerMagicCollision(scene, worldBoundary, playerMagic, collisionPoint);
            }
            else if(labelA==='worldBoundary' && labelB==='opponentMagic' || labelB==='worldBoundary' && labelA==='opponentMagic'){
                const worldBoundary = labelA==='worldBoundary' ? bodyA : bodyB;
                const opponentMagic = labelA==='worldBoundary' ? bodyB : bodyA;
                worldBoundaryOpponentMagicCollision(scene, worldBoundary, opponentMagic, collisionPoint);
            }

            else if(labelA==='playerBox' && labelB==='opponentBox' || labelB==='playerBox' && labelA==='opponentBox'){
                const playerBox = labelA==='playerBox' ? bodyA : bodyB;
                const opponentBox = labelA==='playerBox' ? bodyB : bodyA;
                playerBoxOpponentBoxCollision(scene, playerBox, opponentBox);
            }

            else if(labelA==='opponentArrow' && labelB==='terrain' || labelB==='opponentArrow' && labelA==='terrain'){
                const opponentArrow = labelA==='opponentArrow' ? bodyA : bodyB;
                const terrain = labelA==='opponentArrow' ? bodyB : bodyA;
                opponentArrowTerrainCollision(scene, opponentArrow, terrain);
            }
            else if(labelA==='opponentArrow' && labelB==='worldBoundary' || labelB==='opponentArrow' && labelA==='worldBoundary'){
                const opponentArrow = labelA==='opponentArrow' ? bodyA : bodyB;
                const worldBoundary = labelA==='opponentArrow' ? bodyB : bodyA;
                opponentArrowWorldBoundaryCollision(scene, opponentArrow, worldBoundary);
            }

            else if(labelA==='playerArrow' && labelB==='terrain' || labelB==='playerArrow' && labelA==='terrain'){
                const playerArrow = labelA==='playerArrow' ? bodyA : bodyB;
                const terrain = labelA==='playerArrow' ? bodyB : bodyA;
                playerArrowTerrainCollision(scene, playerArrow, terrain);
            }
            else if(labelA==='playerArrow' && labelB==='worldBoundary' || labelB==='playerArrow' && labelA==='worldBoundary'){
                const playerArrow = labelA==='playerArrow' ? bodyA : bodyB;
                const worldBoundary = labelA==='playerArrow' ? bodyB : bodyA;
                playerArrowWorldBoundaryCollision(scene, playerArrow, worldBoundary);
            }


        });
    });



    scene.matter.world.on("collisionactive", event => {
        event.pairs.forEach(pair => {

            //console.log(pair);
            const collisionNormal = pair.collision.normal;
            const collisionPoint = pair.collision.supports[0].contact.vertex;
            //console.log('collision happened');
            const { bodyA, bodyB } = pair;
            //console.log('pair:', pair);

            const labelA = pair.collision.parentA.label;
            const labelB = pair.collision.parentB.label;

            //console.log('collision active between', labelA, 'and', labelB);
            //console.log(pair);

            if(labelA==='player' && labelB==='terrain' || labelB==='player' && labelA==='terrain' || 
                labelA==='player' && labelB==='worldBoundary' || labelB==='player' && labelA==='worldBoundary'){
                // const player = labelA==='player' ? bodyA : bodyB;
                // const terrain = labelA==='player' ? bodyB : bodyA;

                if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                    scene.playerLastOnGroundTime = scene.time.now;
                    scene.inContactWithGround = true;
                    scene.playerWallSliding = false;
                }
                else{
                    scene.inContactWithWall = true;
                    scene.playerWallSliding = true;
                }


            }

            // else if((labelA==='opponent' && labelB==='terrain' || labelB==='opponent' && labelA==='terrain' || 
            // labelA==='opponent' && labelB==='worldBoundary' || labelB==='opponent' && labelA==='worldBoundary')
            // && scene.botMatch){

            //     if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
            //         //console.log('wall top collision active', scene.time.now);
            //         scene.socket.emit('botGroundCollision');
            //     }
            //     else{
            //         //console.log('wall side collision active', scene.time.now);
            //         scene.socket.emit('botWallCollision', {
            //             lastWallCollisionDirection: collisionPoint.x > scene.opponent.x ? 'right' : 'left'
            //         });

            //     }

            // }
        });
    });

    scene.matter.world.on("collisionend", event => {
        event.pairs.forEach(pair => {

            //console.log(pair);
            const collisionNormal = pair.collision.normal;
            const collisionPoint = pair.collision.supports[0].contact.vertex;
            //console.log('collision happened');
            const { bodyA, bodyB } = pair;
            //console.log('pair:', pair);

            const labelA = pair.collision.parentA.label;
            const labelB = pair.collision.parentB.label;

            //console.log('collision active between', labelA, 'and', labelB);
            //console.log(pair);

            if(labelA==='player' && labelB==='terrain' || labelB==='player' && labelA==='terrain' || 
                labelA==='player' && labelB==='worldBoundary' || labelB==='player' && labelA==='worldBoundary'){
                // const player = labelA==='player' ? bodyA : bodyB;
                // const terrain = labelA==='player' ? bodyB : bodyA;

                if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                    //console.log('wall top collision ended', scene.time.now);
                    scene.playerLastOnGroundTime = scene.time.now;
                    scene.inContactWithGround = false;
                }
                else{
                    //console.log('wall side collision ended', scene.time.now);
                    scene.inContactWithWall = false;
                }

                if(!scene.inContactWithGround && !scene.inContactWithWall){
                    scene.playerWallSliding = false;
                    //scene.playerFriction = 0;
                }

            }
            else if((labelA==='opponent' && labelB==='terrain' || labelB==='opponent' && labelA==='terrain' || 
                    labelA==='opponent' && labelB==='worldBoundary' || labelB==='opponent' && labelA==='worldBoundary')
                    && scene.botMatch){

                if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                    //console.log('wall top collision ended', scene.time.now);
                    scene.socket.emit('botLeftGround');
                    //scene.playerLastOnGroundTime = scene.time.now;
                    //scene.inContactWithGround = false;
                }
                else{
                    //console.log('wall side collision ended', scene.time.now);
                    scene.socket.emit('botLeftWall');
                    //scene.inContactWithWall = false;
                }

                // if(!scene.inContactWithGround && !scene.inContactWithWall){
                //     scene.playerWallSliding = false;
                //     //scene.playerFriction = 0;
                // }
            }

        });
    });
}

const recoilPlayers = (scene: MountainScene, player, opponent) => {
    const pFactor = scene.currentPlayerDirection==='left' ? 1 : -1;
    const oFactor = scene.currentOpponentDirection==='left' ? 1 : -1;
    if(player){
        scene.tweens.add({
            targets: scene.player,
            duration: scene.recoilDuration,
            x: scene.player.body.position.x+(pFactor * scene.swordRecoil)
        });
        scene.socket.emit('playerRecoil');
    }
    if(opponent){
        scene.tweens.add({
            targets: scene.opponent,
            duration: scene.recoilDuration,
            x: scene.opponent.body.position.x+(oFactor * scene.swordRecoil)
        });
    }
};

const makeExplosion = (scene: MountainScene, x: number, y: number, opponent: boolean, collideOpposite = true) => {
    const ex = scene.matter.add.sprite(x, y, opponent ? 'orangeExplosionAtlas': 'blueExplosionAtlas', 'Explosion_1.png');
    const circle = scene.matter.add.circle(x, y, 140);
    ex.setExistingBody(circle);
    ex.body.label = opponent ? 'opponentExplosion' : 'playerExplosion';
    ex.setScale(0.25, 0.25);
    ex.setFixedRotation();
    ex.setIgnoreGravity(true);

    if(opponent){
        ex.body.collisionFilter.category = scene.collisionCategories.opponentExplosion;
        const exclusions = ['terrain', 'opponent', 'playerBox', 'playerArrow', 'opponentArrow', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion'];
        if(!collideOpposite){
            exclusions.push('player');
        }
        setCollisionMask(scene, ex, exclusions);    
    }
    else{
        ex.body.collisionFilter.category = scene.collisionCategories.playerExplosion;
        const exclusions = ['terrain', 'player', 'playerBox', 'playerArrow', 'opponentArrow', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion'];
        if(!collideOpposite){
            exclusions.push('opponent');
        }
        setCollisionMask(scene, ex, exclusions);    
    }

    //ex.setCollisionGroup(opponent ? scene.opponentGroup : scene.playerGroup);
    ex.play(opponent ? 'orangeExplosion': 'blueExplosion');
    ex.once('animationcomplete', () => {
        //console.log('destroying explosion');
        ex.destroy();
    });

    scene.audio.explosionSound.sound.play(scene.audio.explosionSound.config);

    return ex;
}

const setCollisionMask = (scene: MountainScene, gameObj: Phaser.GameObjects.GameObject, exceptions: Array<string>) => {
    let total = 0;
    
    for(const category in scene.collisionCategories){
        if(!exceptions.includes(category)){
            total = total | scene.collisionCategories[category];
        }
    }
    //console.log('total after loop:', total);
    //console.log('setting collision mask for game object:', gameObj);
    //console.log('gameObj.body', gameObj.body);
    //console.log('gameObj body collisionFilter', gameObj.body.collisionFilter);
    gameObj.body.collisionFilter.mask = total;
}

export {handleCollisions, makeExplosion, setCollisionMask};


