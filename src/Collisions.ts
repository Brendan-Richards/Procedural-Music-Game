//import Phaser from 'phaser';
import MountainScene from './MountainScene';

export default (scene: MountainScene): void => {
    //collision between player, ground, and wall
    scene.matter.world.on("collisionstart", (event, body1, body2) => {

        event.pairs.forEach(pair => {
            //console.log(pair);
            const collisionNormal = pair.collision.normal;
            const collisionPoint = pair.collision.supports[0].contact.vertex;
            
            const { bodyA, bodyB } = pair;
            //console.log(pair);
            if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){
                const other = (bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject);
                
                if(other!==null){
                    if(other.tile.properties.collisionLabel==='ground'){
                        //console.log(scene.playerBody.velocity); 
                        scene.inContactWithWall = false;

                        if(scene.currentPlayerAnimation==='airSwing3Loop'){
                            scene.player.play('airSwing3End', true);
                            scene.prevPlayerAnimation = 'airSwing3Loop';
                            scene.currentPlayerAnimation = 'airSwing3End';
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
                                    scene.audio.hardLanding.play(scene.audio.hardLandingConfig);
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
                    else if(other.tile.properties.collisionLabel==='rightSlideable'){
                        // console.log('collided with rightSlidable');
                        scene.playerLastOnGroundTime = scene.time.now;
                        scene.playerRampSliding = true; 
                        scene.playerGroundSlideDirection = 'right';
                        scene.matter.setVelocity(scene.player.body as MatterJS.BodyType,
                                                 scene.player.body.velocity.y,
                                                 scene.player.body.velocity.y)
                        scene.playerWallSliding = false;
                        scene.playerCanJump = true;
                        scene.playerWallJumping = false;
                        scene.playerFlatSliding = false;
                    }
                    else if(other.tile.properties.collisionLabel==='leftSlideable'){
                        //console.log('collided with leftSlidable');
                        scene.playerLastOnGroundTime = scene.time.now;
                        scene.playerRampSliding = true; 
                        scene.playerGroundSlideDirection = 'left';
                        scene.matter.setVelocity(scene.player.body as MatterJS.BodyType,
                                                -1 * scene.player.body.velocity.y,
                                                scene.player.body.velocity.y)
                        scene.playerWallSliding = false;
                        scene.playerCanJump = true;
                        scene.playerWallJumping = false;
                        scene.playerFlatSliding = false;
                    }
                    else if(other.tile.properties.collisionLabel==='wall' || other.tile.properties.collisionLabel==='iceWall'){
                        //console.log('collided with wall');
                        //scene.playerFriction = 0;
                        scene.inContactWithWall = true;
                        scene.wallCollisionDirection = scene.currentPlayerDirection==='left' ? 'left' : 'right';

                        if(scene.currentPlayerAnimation==='idleSwing1' || scene.currentPlayerAnimation==='idleSwing2' || scene.currentPlayerAnimation==='runSwing' ||
                           scene.currentPlayerAnimation==='airSwing1' || scene.currentPlayerAnimation==='airSwing2'){
                            if(!scene.swordCollided){
                                scene.audio.swordSwingSound.stop();
                                scene.audio.swordRockImpact.play(scene.audio.swordRockImpactConfig);
                                const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                                scene.player.setVelocityX(factor * scene.playerSpeed);
                                scene.swordCollided = true;
                            }

                        }
                        else if(scene.meeleeAttacks.includes(scene.currentPlayerAnimation)){
                            //if(!scene.swordCollided){
                                scene.audio.punchSound.stop();
                                scene.audio.fistWallImpact.play(scene.audio.fistWallImpactConfig);
                                const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                                scene.player.setVelocityX(factor * scene.playerSpeed * 0.2);
                                //scene.swordCollided = true;
                            //}
                        }
                        else{
                            if(!scene.losingStamina && scene.currentPlayerAnimation!=='run'){ //&& scene.playerLastOnGroundTime < scene.time.now - 100){
                                if(!scene.gainingStamina){
                                    scene.drawStamina();
                                }
                                scene.losingStamina = true;
                                scene.gainingStamina = false;
                            }

                            if(other.tile.properties.collisionLabel==='iceWall'){
                            // console.log('collided with ice wall');
                                scene.playerFriction = 0;
                                if(!scene.playerIceWallSliding){
                                    scene.resetWallSlide = true;
                                }
                                else{
                                    scene.resetWallSlide = false;
                                }
                                scene.playerIceWallSliding = true;
                                if(scene.currentPlayerAnimation!=='wallSlide' && scene.player.body.velocity.y < 0){
                                    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
                                }

                            }
                            else{
                                //console.log('collided with wall');
                                scene.playerFriction = scene.stamina > 0 ? 0.3 : 0;
                                if(scene.playerIceWallSliding || scene.stamina <= 0){
                                    scene.resetWallSlide = true;
                                }
                                else{
                                    scene.resetWallSlide = false;
                                }
                                scene.playerIceWallSliding = false;
                            }
                            scene.playerWallSliding = true;
                            scene.playerWallJumping = false;
                            //scene.playerCanJump = true;
                            scene.playerRampSliding = false;
                            scene.playerFlatSliding = false;
                        }
                        
                    }
                    else if(other.tile.properties.collisionLabel==='topWall'){
                        //console.log(other);
                        //console.log(collisionNormal);
                        if(scene.currentPlayerAnimation==='idleSwing1' || scene.currentPlayerAnimation==='idleSwing2' || scene.currentPlayerAnimation==='runSwing' ||
                        scene.currentPlayerAnimation==='airSwing1' || scene.currentPlayerAnimation==='airSwing2'){
                            if(!scene.swordCollided){
                                scene.audio.swordSwingSound.stop();
                                scene.audio.swordRockImpact.play(scene.audio.swordRockImpactConfig);
                                const factor = scene.currentPlayerDirection==='left' ? 1 : -1;
                                scene.player.setVelocityX(factor * scene.playerSpeed);
                                scene.swordCollided = true;
                            }
                        }
                        else{
                            console.log(collisionNormal);
                            if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                    
                                console.log('collided with top of topWall block');
    
                                const currentTime = scene.time.now;
                                if(!scene.playerCanJump && currentTime - scene.lastLandingTime > 100){
                                    scene.audio.hardLanding.play(scene.audio.hardLandingConfig);
                                }
                        
                               if(scene.losingStamina){
                                    scene.losingStamina = false;
                                    scene.gainingStamina = true;
                                }
    
                                scene.playerLastOnGroundTime = scene.time.now;
                                scene.playerCanJump = true;
                                scene.playerWallSliding = false;
                                if(scene.playerRampSliding){
                                    scene.playerFlatSliding = true;
                                    scene.playerRampSliding = false;
                                    scene.setFlatSlide = false;
                                } 
                            }
                            else{
                                console.log('collided with side of topWall block');
    
                                //scene.add.circle(collisionPoint.x, collisionPoint.y, 2, 0xff0000).setDepth(100);
                                
                                //scene.playerFriction = 0.01;
                                //console.log(event, body1, body2);
    
                                if(!scene.playerLedgeClimb){
                                    scene.ledgePosition = other.body.position;
                                    //scene.add.circle(scene.ledgePosition.x, scene.ledgePosition.y, 2, 0xffff00).setDepth(100);
                                    //console.log('other.tile:', other.tile);
                                    let grabPositionX;
                                    if(collisionPoint.x > scene.ledgePosition.x){
                                        //the 4 convex top walls
                                        if([10, 12, 100, 102].includes(other.tile.index)){
                                            grabPositionX = other.tile.pixelX + 64 + 3;
                                        }
                                        else{// the 4 concave top walls
                                            grabPositionX = other.tile.pixelX + - 13 + 64;
                                        }
                                        scene.currentPlayerDirection = 'left';
                                    }
                                    else{
                                        if([10, 12, 100, 102].includes(other.tile.index)){
                                            grabPositionX = other.tile.pixelX;
                                        }
                                        else{// the 4 concave top walls
                                            grabPositionX = other.tile.pixelX + 15;
                                        }
                                        scene.currentPlayerDirection = 'right';
                                    };
    
                                    const grabPositionY = other.tile.pixelY + 22;
                                    const buffer = 20;
    
                                    //if we collided with the outward facing side of the tile block
                                    if(collisionPoint.x > scene.ledgePosition.x && [125, 102, 35, 12].includes(other.tile.index) ||
                                       collisionPoint.x < scene.ledgePosition.x && [10, 33, 100, 123].includes(other.tile.index)){
                                        if(grabPositionY - 2 * buffer < scene.player.body.position.y && scene.player.body.position.y < grabPositionY + buffer && scene.stamina > 0){
                                            scene.playerLedgeGrab = true;
                                            if(!scene.staminaActive){
                                                scene.drawStamina();
                                                scene.losingStamina = true; 
                                            }
                                            scene.gainingStamina = false;
                                            scene.player.setPosition(grabPositionX, grabPositionY);
                                            scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
                                            scene.playerWallSliding = false;
                                        }
                                        else{
                                            scene.playerFriction = scene.stamina > 0 ? 0.3 : 0;
                                            scene.playerWallSliding = true;
                                        }
                                    }
                                    else{
                                        scene.playerCanJump = true;
                                    }
    
                                    // if(scene.playerLedgeGrab){
                                    //     scene.losingStamina = true;
                                    // }
    
                                    scene.playerRampSliding = false;
                                    scene.playerFlatSliding = false;
                                    //scene.playerCanJump = false;
                                    scene.playerWallJumping = false;
                                }
    
                            }
                        }


                    }
                }
            }
        });
    });

    scene.matter.world.on("collisionactive", event => {
        event.pairs.forEach(pair => {
            const collisionNormal = pair.collision.normal;
            const { bodyA, bodyB } = pair;
            //console.log(pair);
            if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){
                const other = bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject;
                if(other!==null){
                    if(other.tile.properties.collisionLabel==='ground' ||
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
            //console.log(pair);
            if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){
                const other = bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject;
                if(other!==null){
                    if(other.tile.properties.collisionLabel==='ground'){
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
