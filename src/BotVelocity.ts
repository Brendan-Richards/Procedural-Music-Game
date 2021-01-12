import MountainScene from './MountainScene';

type velocity = {
    x: number,
    y: number
}


const setBotVelocity = (scene: MountainScene, velocityType: string, prevOpponentAnimation: string) => {
    console.log('setting bot velocity');
    console.log('velocity type:', velocityType);
    console.log('currentOpponentAnimation:', scene.currentOpponentAnimation);
    console.log('prevOpponentAnimation:', prevOpponentAnimation);

    const prevVelocity = {x: scene.opponent?.body.velocity.x, y: scene.opponent?.body.velocity.y};
    if(velocityType==='ground'){
        setGroundVelocity(scene, prevVelocity, prevOpponentAnimation);
    }
    else{//velocityType==='air'
        setAirVelocity(scene, prevVelocity, prevOpponentAnimation);
    }
}

const setGroundVelocity = (scene: MountainScene, prevVelocity: velocity, prevOpponentAnimation: string) => {
    //set the characters speed depending on the active animation and active direction
    switch(scene.currentOpponentAnimation.substring(0, scene.currentOpponentAnimation.length-8)){
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
            scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
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
            if(scene.currentOpponentDirection==='right'){
                scene.matter.setVelocity(scene.opponent?.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.currentOpponentDirection==='left'){
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
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
            if(prevOpponentAnimation==='idle' || prevOpponentAnimation==='idleSword' || prevOpponentAnimation==='idleSwordDrawn' || prevOpponentAnimation==='idleBowDrawn'){
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, prevVelocity.x, -1*scene.playerJumpHeight);
            }
            else{
                const factor = scene.currentOpponentDirection==='left' ? -1 : 1;
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, factor*scene.playerSpeed, -1*scene.playerJumpHeight);
            }
            break;
        } 
        default: break;
    }
}


const setAirVelocity = (scene: MountainScene, prevVelocity: velocity, prevOpponentAnimation: string) => {
    //set the characters speed depending on the active animation and active direction
    switch(scene.currentOpponentAnimation.substring(0, scene.currentOpponentAnimation.length-8)){
        case 'wallSlideSwordDrawn':
        case 'wallSlideBowDrawn':
        case 'wallSwing':
        case 'wallSlideGlove':
        case 'wallSlide': {
            const factor = scene.currentOpponentDirection==='left' ? -1 : 1;
            //scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, factor*0.3, prevVelocity.y);
            break;
        }
        case 'ledgeGrab':
        case 'ledgeGrabGlove':
        case 'ledgeGrabSwordDrawn':
        case 'ledgeGrabBowDrawn': {
            scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, 0);
            break;
        }
        case 'airSwing3Start':
        case 'airSwing3Loop': {
            scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, scene.playerMaxSpeed);
            break;
        }
        case 'fallHoldLoop': {
            if(scene.inContactWithWall){
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
                break;
            }
        }
       // case 'jumpGlove':
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
            if(scene.currentOpponentDirection==='right'){
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.currentOpponentDirection==='left'){
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                break;
            }
            else{
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
                break;
            }
        } 
        case 'jumpSwordDrawn':
        case 'jumpBowDrawn':
        case 'jumpGlove':
        case 'jump': {

            if(scene.currentOpponentDirection==='right'){
                //scene.currentPlayerDirection = 'right';
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.currentOpponentDirection==='left'){
                //scene.currentPlayerDirection = 'left';
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, -1*scene.playerSpeed, prevVelocity.y);
                break;
            }
            else if(scene.controlConfig.leftControl.isUp && scene.controlConfig.rightControl.isUp){
                scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, prevVelocity.y);
                break;
            }
            
        }
        default: break;
    }
}


export default setBotVelocity;