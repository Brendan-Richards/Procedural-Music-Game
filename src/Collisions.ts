//import Phaser from 'phaser';
import MountainScene from './MountainScene';

const emitAnimationEvent = (scene: MountainScene, animationName: string, flipX: boolean) => {
    scene.socket.emit('playerNewAnimation', {
        animation: animationName, 
        flipX: flipX, 
        friction: scene.playerFriction
    });
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
            //console.log(pair);

            if(['opponentMagic', 'playerMagic'].includes(bodyA.gameObject.name) || ['opponentMagic', 'playerMagic'].includes(bodyB.gameObject.name)){
                console.log('collision involving magic');
                
                if(['opponentMagic', 'playerMagic'].includes(bodyA.gameObject.name) && ['opponentMagic', 'playerMagic'].includes(bodyB.gameObject.name)){
                    console.log('player magic collided with opponent magic');

                }
                else{ // only one of the bodies is magic
                    const magic = ['opponentMagic', 'playerMagic'].includes(bodyA.gameObject.name) ? bodyA.gameObject : bodyB.gameObject;
                    const other = ['opponentMagic', 'playerMagic'].includes(bodyA.gameObject.name) ? bodyB.gameObject : bodyA.gameObject;

                    if(other===scene.player || other===scene.opponent){
                        console.log('player hit by opponent magic');
                        other.destroy();
        
                        scene.socket.emit('explosion', {x: scene.player.x, y: scene.player.y, opponent: true});
                        const ex = makeExplosion(scene, scene.player.x, scene.player.y, true);
                        
                        ex.setCollisionGroup(scene.playerGroup);
                        scene.matter.setVelocity(ex, scene.player.body.velocity.x, scene.player.body.velocity.y);
        
                        scene.socket.emit('playerDamaged', scene.magicDamageAmount);
                        scene.playerHealthBar.decrease(scene.magicDamageAmount);
                    }
                    else if(!other || other.name==='terrain'){
                        makeExplosion(scene, collisionPoint.x, collisionPoint.y, magic.name==='opponentMagic');
                    }
                }
                
            }
            else if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){// if one of the objects is the player
                let other = (bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject);
                console.log('other object that isnt the player', other);
                if(other!==null){
                    if(other===scene.opponent){ // player collided with opponent
                        console.log('collided with opponent');
                    }
                    else if(other.name==='terrain'){
                        //console.log('collided with terrain');

                        //console.log(collisionNormal);
                        
                        if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                            const both = scene.inContactWithWall && scene.inContactWithGround;

                            if(!both){
                                console.log('collided with top of terrain');
                                console.log('wall top collision time:', scene.time.now);
                                scene.lastGroundCollision = scene.time.now;
                                //scene.inContactWithWall = false;
                                scene.inContactWithGround = true;
                                scene.playerCanJump = true;

                                // const validContactTime = scene.lastWallCollision === scene.lastGroundCollision;
                                // if(validContactTime){
                                //     scene.player.setVelocity(0, -8);
                                // }

                                if(scene.currentPlayerAnimation==='airSwing3Loop'){
                                    scene.player.play('airSwing3End', true);
                                    scene.prevPlayerAnimation = 'airSwing3Loop';
                                    scene.currentPlayerAnimation = 'airSwing3End';
                                    emitAnimationEvent(scene, 'airSwing3End', scene.currentPlayerDirection==='left');
                                }
                                else if(scene.currentPlayerAnimation==='airSwing3End'){
                                    scene.playerCanJump = false;
                                }
                                else{
                                    if(scene.losingStamina){
                                        scene.losingStamina = false;
                                        scene.gainingStamina = true;
                                    }
            
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
                            console.log('collided with side of terrain');
                            console.log('wall side collision time:', scene.time.now);
                            scene.inContactWithWall = true;
                            scene.lastWallCollision = scene.time.now;
                            const both = scene.inContactWithWall && scene.inContactWithGround;
                            const validContactTime = scene.lastWallCollision === scene.lastGroundCollision;

                            if(!scene.playerCanJump && scene.player.body.velocity.y < 0 || both && !scene.playerCanJump){
                                //const timeSinceJump = scene.time.now - scene.playerLastOnGroundTime;
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
                                    if(!scene.losingStamina && scene.currentPlayerAnimation!=='run'){ //&& scene.playerLastOnGroundTime < scene.time.now - 100){
                                        if(!scene.gainingStamina){
                                            scene.drawStamina();
                                        }
                                        scene.losingStamina = true;
                                        scene.gainingStamina = false;
                                    }
    
                                    
                                    //console.log('collided with wall');
                                    scene.playerFriction = scene.stamina > 0 ? 0 : 0;
                                    
                                    if(scene.playerIceWallSliding || scene.stamina <= 0){
                                        scene.resetWallSlide = true;
                                    }
                                    else{
                                        scene.resetWallSlide = false;
                                    }
                                    scene.playerIceWallSliding = false;
                                    
                                    scene.playerWallSliding = true;
                                    scene.playerWallJumping = false;
                                    //scene.playerCanJump = true;
                                    scene.playerRampSliding = false;
                                    scene.playerFlatSliding = false;
                                }
                            }
                        }
                    }
                    // else if(other===scene.opponentAttackBox){

                    // }
                    // else if(){

                        
                        // // scene.playerHealthBar.decrease(10);
                        // // scene.opponentHealthBar.decrease(10);
                    // }
                    else if(other.texture.key==='arrow'){ // player collided with enemy arrow
                        //if(!scene.swordAttacks.includes(scene.currentPlayerAnimation)){
                        const damageAmount = 20;
                        scene.playerHealthBar.decrease(damageAmount);
                        scene.socket.emit('playerDamaged', damageAmount);
                        scene.audio.arrowBodyImpact.sound.play(scene.audio.arrowBodyImpact.config);
                        scene.socket.emit('playerSound', {name: 'arrowBodyImpact', x: scene.player.x, y: scene.player.y});
                        //}
                        const arrowIndex = scene.opponentArrows.findIndex(val => {
                            return val===other;
                        });

                        console.log('hit with arrow at opponent arrow list index', arrowIndex);
                        scene.opponentArrows.splice(arrowIndex, 1);

                        console.log('still have reference to arrow', other);
                        other.destroy();
                        // other.setCollisionGroup(-3);
                        // scene.matter.add.constraint(scene.player, other, 20, 1);
                        //scene.add.circle(collisionPoint.x, collisionPoint.y, 2, 0xff0000).setDepth(100); 
                    }
                    //console.log(other);
                    
 
                }
                else if(bodyA===scene.opponentAttackBox || bodyB===scene.opponentAttackBox){
                    console.log('player collided with opponent attack box');
                    other =  bodyA===scene.opponentAttackBox ? bodyA : bodyB;
                    recoilPlayers(scene, false, true);
                    // scene.socket.emit('swordRecoil');
                    // if(scene.swordAttacks.includes(scene.currentPlayerAnimation) && scene.swordAttacks.includes(scene.currentOpponentAnimation)){
                    //     //both player and opponent are sword attacking
                        
                    //     const option1 = scene.currentPlayerDirection==='right' && collisionPoint.x > scene.player.x && scene.currentOpponentDirection==='left' && collisionPoint.x < scene.opponent.x;
                    //     const option2 = scene.currentPlayerDirection==='left' && collisionPoint.x < scene.player.x && scene.currentOpponentDirection==='right' && collisionPoint.x > scene.opponent.x;
                    //     //if they are facing eachother
                    //     if(option1 || option2){
                    //         if(!scene.audio.swordSwordImpact.isPlaying){
                    //             scene.audio.swordSwordImpact.play(scene.audio.swordSwordImpactConfig);
                    //         }  
                    //     }
                    // }
                    //else if(scene.swordAttacks.includes(scene.currentOpponentAnimation) && scene.time.now - scene.lastSwordDamageTime > 500){
                    if(!scene.bothAttacking && scene.time.now - scene.lastSwordDamageTime > 500){

                        const facingEachother = scene.currentPlayerDirection==='left' && scene.currentOpponentDirection==='right' ||
                                                scene.currentPlayerDirection==='right' && scene.currentOpponentDirection==='left';
                        const bothHitboxes = scene.playerAttackBox && scene.opponentAttackBox;
                        const closeEnough = scene.player.x + 30 > scene.opponent.x && scene.player.x - 30 < scene.opponent.x;
                        const noDamage = facingEachother && bothHitboxes && closeEnough;

                        if(!noDamage){
                            //player should take damage
                            const damageAmount = 10;
                            
                            scene.audio.swordBodyImpact.sound.play(scene.audio.swordBodyImpact.config);
                            scene.socket.emit('playerSound', {name: 'swordBodyImpact', x: scene.player.x, y: scene.player.y});
                                
                            scene.socket.emit('playerDamaged', damageAmount);
                            scene.playerHealthBar.decrease(damageAmount);

                            scene.lastSwordDamageTime = scene.time.now;

                            const blood = scene.add.sprite(scene.player.x, scene.player.y, 'bloodAtlas', '1_0.png');
                            blood.play('blood');
                            blood.once('animationcomplete', animation => {
                                console.log('finished blood animation');
                                blood.destroy();
                            });
                            
                            scene.socket.emit('bloodAnimation', {
                                x: scene.player.x,
                                y: scene.player.y
                            });
                        }
                    }


                }
            }
            else if(bodyA.gameObject===scene.opponent || bodyB.gameObject===scene.opponent){// if one of the objects is the opponent
                const other = (bodyA.gameObject===scene.opponent ? bodyB.gameObject : bodyA.gameObject);

                if(other !== null){
                    if(other.texture && other.texture.key==='arrow'){ // opponent collided with player arrow
                        const arrowIndex = scene.playerArrows.findIndex(val => {
                            return val===other;
                        });
    
                        console.log('opponent hit with arrow at player arrow list index', arrowIndex);
    
                        if(arrowIndex !== -1){
                            other.destroy();
                        }

                        const blood = scene.add.sprite(scene.opponent.x, scene.opponent.y, 'bloodAtlas', '1_0.png');
                        blood.play('blood');
                        scene.socket.emit('bloodAnimation', {
                            x: scene.opponent.x,
                            y: scene.opponent.y
                        });
                        blood.once('animationcomplete', animation => {
                            console.log('finished blood animation');
                            blood.destroy();
                        });
    
                        // other.setCollisionGroup(-3);
                        // scene.matter.add.constraint(scene.player, other, 20, 1);
                        //scene.add.circle(collisionPoint.x, collisionPoint.y, 2, 0xff0000).setDepth(100); 
                    }
                }
                if(bodyA===scene.playerAttackBox || bodyB===scene.playerAttackBox){//other object is players attack box
                    recoilPlayers(scene, true, false);
                }

            }
            else if(bodyA===scene.opponentAttackBox || bodyB===scene.opponentAttackBox){// one of the objects is the opponents attack box
                console.log('one of the objects was the opponents attack box');
                let other = (bodyA===scene.opponentAttackBox ? bodyB.gameObject : bodyA.gameObject);
                if(other && other.texture && other.texture.key==='arrow'){
                    const arrowIndex = scene.playerArrows.findIndex(val => {
                        return val===other;
                    });

                    console.log('opponent attack box hit with arrow at player arrow list index', arrowIndex);

                    if(arrowIndex !== -1){
                        scene.playerArrows.splice(arrowIndex, 1);
                        // scene.playerArrows[arrowIndex].setAngularVelocity(Math.random() * 4 - 2);
                        other.setAngularVelocity(Math.random() * 4 - 2);
                        const factor = scene.currentOpponentDirection==='left' ? -1 : 1;
                        other.setVelocity(factor * 2, -2);

                        setTimeout(() => {
                            other.destroy();
                        }, 3000)
                    }
                       
                }
                else if(bodyA===scene.playerAttackBox || bodyB===scene.playerAttackBox){//other object is players attack box
                    //other = (bodyA===scene.playerAttackBox ? bodyB.gameObject : bodyA.gameObject);
                    scene.audio.swordSwordImpact.sound.play(scene.audio.swordSwordImpact.config);
                    scene.socket.emit('playerSound', {name: 'swordSwordImpact', x: scene.player.x, y: scene.player.y});
                    scene.bothAttacking = true;
                    console.log('setting both players attacking to true');
                    scene.player.once('animationstart', () => {
                        console.log('setting both players attacking to false');
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
            }
            else if(bodyA===scene.playerAttackBox || bodyB===scene.playerAttackBox){// one of the objects is the players attack box
                console.log('one of the objects was the players attack box');
                const other = (bodyA===scene.playerAttackBox ? bodyB.gameObject : bodyA.gameObject);
                if(other && other.texture && other.texture.key==='arrow'){
                    const arrowIndex = scene.opponentArrows.findIndex(val => {
                        return val===other;
                    });

                    if(arrowIndex !== -1){
                        scene.opponentArrows.splice(arrowIndex, 1);
                        // scene.playerArrows[arrowIndex].setAngularVelocity(Math.random() * 4 - 2);
                        other.setAngularVelocity(Math.random() * 4 - 2);
                        const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
                        other.setVelocity(factor * 2, -2);

                        setTimeout(() => {
                            other.destroy();
                        }, 3000)
                    }
                    
                    
                }
            }
        });
    });

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

    }

    scene.matter.world.on("collisionactive", event => {
        event.pairs.forEach(pair => {
            const collisionNormal = pair.collision.normal;
            const { bodyA, bodyB } = pair;
            //console.log(pair);
            if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){
                const other = bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject;
                if(other!==null){
                    if(!other.tile){ //we didn't collide with a tile
                        if(other===scene.opponent){
                            console.log('opponent collision active');
                        }
                        else if(other.name==='terrain'){
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
                    }
                    else if(other.tile.properties.collisionLabel==='ground' ||
                       other.tile.properties.collisionLabel==='leftSlideable' ||
                       other.tile.properties.collisionLabel==='rightSlideable'){
                        scene.playerLastOnGroundTime = scene.time.now;
                    }
                    else if(other.tile.properties.collisionLabel==='topWall'){
                        if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                            scene.playerLastOnGroundTime = scene.time.now;
                        }
                    }
                    else if(other.tile.properties.collisionLabel==='wall' ||
                            other.tile.properties.collisionLabel==='iceWall'){
                        scene.playerLastOnWallTime = scene.time.now;
                        scene.inContactWithWall = true;
                    }
                }
            }
        });
    });

    scene.matter.world.on("collisionend", event => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            const collisionNormal = pair.collision.normal;
            //console.log(pair);
            if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){
                const other = bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject;
                if(other!==null){
                    if(!other.tile){ //we didn't collide with a tile because other.tile is undefined
                        if(other===scene.opponent){
                            console.log('opponent collision ended');
                        }
                        else if(other.name==='terrain'){
                            if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                                console.log('wall top collision ended', scene.time.now);
                                scene.playerLastOnGroundTime = scene.time.now;
                                scene.inContactWithGround = false;
                            }
                            else{
                                console.log('wall side collision ended', scene.time.now);
                                scene.inContactWithWall = false;
                            }

                            if(!scene.inContactWithGround && !scene.inContactWithWall){
                                scene.playerWallSliding = false;
                            }
                            // if(scene.inContactWithWall){
                                
                            //     scene.playerWallSliding = false;
                            // }
                            
                        }
                    }
                    else if(other.tile.properties.collisionLabel==='ground'){
                        scene.playerLastOnGroundTime = scene.time.now;
                    }
                    else if(other.tile.properties.collisionLabel==='leftSlideable'){
                        scene.playerLastOnGroundTime = scene.time.now;
                    }
                    else if(other.tile.properties.collisionLabel==='rightSlideable'){
                        scene.playerLastOnGroundTime = scene.time.now;
                    }
                    else if(other.tile.properties.collisionLabel==='wall' ||
                            other.tile.properties.collisionLabel==='iceWall'){
                        scene.playerLastOnWallTime = scene.time.now;
                    }
                }
            }
        });
    });
}

const makeExplosion = (scene: MountainScene, x: number, y: number, opponent: boolean) => {
    const ex = scene.matter.add.sprite(x, y, opponent ? 'orangeExplosionAtlas': 'blueExplosionAtlas', 'Explosion_1.png');
    const circle = scene.matter.add.circle(x, y, 80);
    ex.setExistingBody(circle);
    ex.setScale(0.25, 0.25);
    ex.setFixedRotation()
    ex.setIgnoreGravity(true);
    ex.setCollisionGroup(opponent ? scene.opponentGroup : scene.playerGroup);
    ex.play(opponent ? 'orangeExplosion': 'blueExplosion');
    ex.once('animationcomplete', () => {
        console.log('destroying explosion');
        ex.destroy();
    });
    return ex;
}

export {handleCollisions, makeExplosion};
