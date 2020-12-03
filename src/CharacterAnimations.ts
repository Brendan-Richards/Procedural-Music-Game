
import MountainScene from './MountainScene';

const animationLogic = (scene: MountainScene) => {
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    scene.player.on('animationcomplete', (animation, frame) => {
        //console.log('in animation complete callback');
        if(animation.key==='bowKick'){
            scene.playerAttacking = false;
            scene.bowKick = false;
        }
        else if(animation.key==='idleSwing1' || animation.key==='idleSwing2' || animation.key==='runSwing'){
            scene.playerAttacking = false;
            //const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
            //scene.player.setPosition(scene.player.x + (10*nudge), scene.player.y);
        }
        else if(scene.swordAttacks.includes(animation.key) || scene.meeleeAttacks.includes(animation.key)){
            //console.log('setting player attacking flag to false');
            scene.playerAttacking = false;
            if(animation.key==='groundKick'){
                scene.playerKick = false;
            }
        }
        else if(scene.magicAttacks.includes(animation.key)){
            switch(animation.key){
                case 'idleCastRed':
                case 'idleCastBlue': {
                    if(scene.stopCasting){
                        console.log('idleCast ended')
                        scene.player.play('idleGlove', true);
                        scene.prevPlayerAnimation = 'idleCast';
                        scene.currentPlayerAnimation = 'idleGlove'; 
                        scene.playerAttacking = false;
                        scene.stopCasting = false;
                        emitAnimationEvent(scene, 'idleGlove', scene.currentPlayerDirection==='left');
                    }
                    
                    break;
                }
                case 'runCastRed':
                case 'runCastBlue': {
                    if(scene.stopCasting){
                        console.log('runCast ended')
                        scene.player.play('runGlove', true);
                        scene.prevPlayerAnimation = 'runCast';
                        scene.currentPlayerAnimation = 'runGlove'; 
                        scene.playerAttacking = false;
                        scene.stopCasting = false;
                        emitAnimationEvent(scene, 'runGlove', false);
                    }
                    break;
                }
                case 'jumpCastRed':
                case 'jumpCastBlue': {
                    if(scene.stopCasting){
                        console.log('jumpCast ended')
                        scene.player.play('jumpGlove', true);
                        scene.prevPlayerAnimation = 'jumpCast';
                        scene.currentPlayerAnimation = 'jumpGlove'; 
                        scene.playerAttacking = false;
                        scene.stopCasting = false;
                        emitAnimationEvent(scene, 'jumpGlove', false);
                    }
 
                    break;
                }
                case 'fallCastRed':
                case 'fallCastBlue': {
                    if(scene.stopCasting){
                        console.log('fallCast ended')
                        scene.player.play('fallGlove', true);
                        scene.prevPlayerAnimation = 'fallCast';
                        scene.currentPlayerAnimation = 'fallGlove'; 
                        scene.playerAttacking = false;
                        scene.stopCasting = false;
                        emitAnimationEvent(scene, 'fallGlove', false);
                    }
                    break;
                }
                case 'wallSlideCastRed':
                case 'wallSlideCastBlue': {
                    if(scene.stopCasting){
                        console.log('wallSlideCast ended')
                        scene.player.play('wallSlideGlove', true);
                        scene.prevPlayerAnimation = 'wallSlideCast';
                        scene.currentPlayerAnimation = 'wallSlideGlove'; 
                        scene.playerAttacking = false;
                        scene.stopCasting = false;
                        emitAnimationEvent(scene, 'wallSlideGlove', false);
                    }
 
                    break;
                }
            }
        }
        else if(scene.bowAttacks.includes(animation.key)){
            switch(animation.key){
                //ground bow attacks
                case 'idleNotch': {
                    scene.player.play('idleHoldLoop', true);
                    scene.prevPlayerAnimation = 'idleNotch';
                    scene.currentPlayerAnimation = 'idleHoldLoop'; 
                    emitAnimationEvent(scene, 'idleHoldLoop', scene.currentPlayerDirection==='left');
                    break;
                }
                case 'runNotch': {
                    scene.player.play('runHoldLoop', true);
                    scene.prevPlayerAnimation = 'runNotch';
                    scene.currentPlayerAnimation = 'runHoldLoop';
                    emitAnimationEvent(scene, 'runHoldLoop', scene.currentPlayerDirection==='left'); 
                    break;
                }

                //air bow attacks
                case 'jumpNotch': {
                    scene.player.play('jumpHoldLoop', true);
                    scene.prevPlayerAnimation = 'jumpNotch';
                    scene.currentPlayerAnimation = 'jumpHoldLoop'; 
                    emitAnimationEvent(scene, 'jumpHoldLoop', scene.currentPlayerDirection==='left');
                    break;
                }
                case 'fallNotch': {
                    scene.player.play('fallHoldLoop', true);
                    console.log('playing fallHoldLoop')
                    scene.prevPlayerAnimation = 'fallNotch';
                    scene.currentPlayerAnimation = 'fallHoldLoop'; 
                    emitAnimationEvent(scene, 'fallHoldLoop', scene.currentPlayerDirection==='left');
                    break;
                }
            }
        }
        else if(animation.key==='airSwing3Start'){
            scene.player.play('airSwing3Loop', true);
            scene.prevPlayerAnimation = 'airSwing3Start';
            scene.currentPlayerAnimation = 'airSwing3Loop';
            emitAnimationEvent(scene, 'airSwing3Loop', scene.currentPlayerDirection==='left');
        }

        else if(animation.key==='airSwing3End'){
            scene.downAttack = false;
            scene.playerAttacking = false;
            scene.playerCanJump = true;
        }
    }, scene);

};

const emitAnimationEvent = (scene: MountainScene, animationName: string, flipX: boolean) => {
    scene.socket.emit('playerNewAnimation', {
        animation: animationName, 
        flipX: flipX, 
        friction: scene.playerFriction
    });
};

const createAnimations = (scene: MountainScene, suffix = '', atlasName = 'characterAtlas') => {
    const frameRate = 10;
    const swingFrameRate = 17;
    const magicFrameRate = 10;
    const bloodFrameRate = 30;
    const explosionFrameRate = 20;


    // sword equipped animations
    scene.anims.create({
        key: 'idleSwordDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleSwordDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'runSwordDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runSwordDrawn_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'jumpSwordDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpSwordDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'wallSlideSwordDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_wallSlideSwordDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'ledgeGrabSwordDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_ledgeGrabSwordDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'fallSwordDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallSwordDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'idleSwing1'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleSwing1_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'idleSwing2'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleSwing2_', 
            suffix: '.png',
            end: 5, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runSwing'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runSwing_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing1'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_airSwing1_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing2'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_airSwing2_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing3Start'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_airSwing3Start_', 
            suffix: '.png',
            end: 1, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing3Loop'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_airSwing3Loop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'airSwing3End'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_airSwing3End_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'wallSwing'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_wallSwing_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });


    // bow equipped animations
    scene.anims.create({
        key: 'idleBowDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleBowDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'runBowDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runBowDrawn_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'jumpBowDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpBowDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'wallSlideBowDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_wallSlideBowDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'ledgeGrabBowDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_ledgeGrabBowDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'fallBowDrawn'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallBowDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'idleNotch'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleNotch_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'runNotch'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runNotch_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'jumpNotch'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpNotch_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'fallNotch'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallNotch_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'idleHoldLoop'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleHoldLoop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'runHoldLoop'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runHoldLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'jumpHoldLoop'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpHoldLoop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'fallHoldLoop'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallHoldLoop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'idleRelease'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleRelease_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runRelease'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runRelease_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'jumpRelease'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpRelease_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'fallRelease'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallRelease_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'bowKick'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_bowKick_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    }); 


    // casting glove magic animations
    scene.anims.create({
        key: 'idleGlove'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleGlove_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'runGlove'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runGlove_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'jumpGlove'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpGlove_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'fallGlove'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallGlove_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'ledgeGrabGlove'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_ledgeGrabGlove_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'wallSlideGlove'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_wallSlideGlove_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });

    //casting animations
    // blue magic
    scene.anims.create({
        key: 'idleCastBlue'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_idleCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'runCastBlue'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_runCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'jumpCastBlue'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_jumpCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'fallCastBlue'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_fallCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'wallSlideCastBlue'+ suffix,
        frames: scene.anims.generateFrameNames(atlasName, {
            prefix: 'adventurer_wallSlideCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });


    //////////////////////////////////////////////////////////////////////////////////////////
    //magic projectile animations
    scene.anims.create({
        key: 'redMagic'+ suffix,
        frames: scene.anims.generateFrameNames('magicAtlas', {
            prefix: 'redMagic_', 
            suffix: '.png',
            end: 20, 
            zeroPad: 2 
            }),
            frameRate: magicFrameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'blueMagic'+ suffix,
        frames: scene.anims.generateFrameNames('magicAtlas', {
            prefix: 'blueMagic_', 
            suffix: '.png',
            end: 20, 
            zeroPad: 2 
            }),
            frameRate: magicFrameRate,
            repeat: -1
    });

    //blood effects
    scene.anims.create({
        key: 'blood',
        frames: scene.anims.generateFrameNames('bloodAtlas', {
            prefix: '1_', 
            suffix: '.png',
            end: 15, 
            zeroPad: 1 
            }),
            frameRate: bloodFrameRate
    }); 
    //explosion effects
    scene.anims.create({
        key: 'blueExplosion',
        frames: scene.anims.generateFrameNames('blueExplosionAtlas', {
            prefix: 'Explosion_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 1 
            }),
            frameRate: explosionFrameRate
    });   
    scene.anims.create({
        key: 'orangeExplosion',
        frames: scene.anims.generateFrameNames('orangeExplosionAtlas', {
            prefix: 'Explosion_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 1 
            }),
            frameRate: explosionFrameRate
    });    

};

export {animationLogic, createAnimations};
