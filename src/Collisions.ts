//import Phaser from 'phaser';
import MountainScene from './MountainScene';

export default (scene: MountainScene): void => {
    //collision between player, ground, and wall
    scene.matter.world.on("collisionstart", event => {

        event.pairs.forEach(pair => {
            const collisionNormal = pair.collision.normal;
            const { bodyA, bodyB } = pair;
            //console.log(pair);
            if(bodyA.gameObject===scene.player || bodyB.gameObject===scene.player){
                const other = bodyA.gameObject===scene.player ? bodyB.gameObject : bodyA.gameObject;
                
                if(other!==null){
                    if(other.tile.properties.collisionLabel==='ground'){
                        //console.log(scene.playerBody.velocity); 
                        const currentTime = scene.time.now;
                        if(!scene.playerCanJump && currentTime - scene.lastLandingTime > 100){// if player is colliding with ground from mid air
                            //if(currentTime - scene.playerLastOnGroundTime > 2000){
                            if(scene.playerBody.velocity.y > 10){
                                //console.log('playing hard landing');
                                scene.audio.hardLanding.play(scene.audio.hardLandingConfig);
                            }
                            else{
                                //console.log('playing soft landing');
                                scene.audio.softLanding.play(scene.audio.softLandingConfig);                                
                            }

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
                    else if(other.tile.properties.collisionLabel==='wall' ||
                            other.tile.properties.collisionLabel==='iceWall'){
                        //console.log('collided with wall');
                        //scene.playerFriction = 0;
                        
                        if(other.tile.properties.collisionLabel==='iceWall'){
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
                            scene.playerFriction =  0.3;
                            if(scene.playerIceWallSliding){
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
                    else if(other.tile.properties.collisionLabel==='topWall'){
                        //console.log(other);
                        //console.log(collisionNormal);
                        if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                           // console.log('collided with top of topWall block');
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
                            //console.log('collided with side of topWall block');
                            scene.playerFriction = 0.01;
                            scene.playerWallSliding = false;
                            scene.playerRampSliding = false;
                            scene.playerFlatSliding = false;
                            scene.playerCanJump = false;
                            scene.playerWallJumping = false;
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
                }
            }
        });
    });
}
