//import Phaser from 'phaser';
import MountainScene from './MountainScene';
//import MatterJS from 'matter';

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
                        scene.playerLastOnGroundTime = new Date().getTime();
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
                        scene.playerLastOnGroundTime = new Date().getTime();
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
                        scene.playerLastOnGroundTime = new Date().getTime();
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
                    else if(other.tile.properties.collisionLabel==='wall'){
                        //console.log('collided with wall');
                        scene.playerFriction = 0.3;
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
                            scene.playerLastOnGroundTime = new Date().getTime();
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
                        scene.playerLastOnGroundTime = new Date().getTime();
                    }
                    else if(other.tile.properties.collisionLabel==='topWall'){
                        if(Math.abs(Math.round(collisionNormal.x))===0 && Math.abs(Math.round(collisionNormal.y))===1){
                            scene.playerLastOnGroundTime = new Date().getTime();
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
                        scene.playerLastOnGroundTime = new Date().getTime();
                    }
                    else if(other.tile.properties.collisionLabel==='leftSlideable'){
                        scene.playerLastOnGroundTime = new Date().getTime();
                    }
                    else if(other.tile.properties.collisionLabel==='rightSlideable'){
                        scene.playerLastOnGroundTime = new Date().getTime();
                    }
                }
            }
        });
    });
}
