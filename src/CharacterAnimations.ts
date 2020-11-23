
//import Phaser from 'phaser';
import { Scene } from 'phaser';
import MountainScene from './MountainScene';

export default (scene: MountainScene) => {
    
    const frameRate = 10;
    const swingFrameRate = 18;
    const magicFrameRate = 10;

    // no weapon animations
    scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idle_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'run',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_run_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'jump',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jump_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'wallSlide',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlide_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'ledgeGrab',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeGrab_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'fall',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fall_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'punch1',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_punch1_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'punch2',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_punch2_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'punch3',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_punch3_', 
            suffix: '.png',
            end: 5, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runPunch',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runPunch_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'groundKick',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_groundKick_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airKick',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airKick_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });


    // sword equipped animations
    scene.anims.create({
        key: 'idleSwordDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleSwordDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'runSwordDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runSwordDrawn_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'jumpSwordDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpSwordDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'wallSlideSwordDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideSwordDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'ledgeGrabSwordDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeGrabSwordDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'fallSwordDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallSwordDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'idleSwing1',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleSwing1_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'idleSwing2',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleSwing2_', 
            suffix: '.png',
            end: 5, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runSwing',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runSwing_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing1',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airSwing1_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing2',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airSwing2_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing3Start',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airSwing3Start_', 
            suffix: '.png',
            end: 1, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'airSwing3Loop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airSwing3Loop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'airSwing3End',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airSwing3End_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'wallSwing',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSwing_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });


    // bow equipped animations
    scene.anims.create({
        key: 'idleBowDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleBowDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'runBowDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runBowDrawn_', 
            suffix: '.png',
            end: 6, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'jumpBowDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpBowDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'wallSlideBowDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideBowDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'ledgeGrabBowDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeGrabBowDrawn_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'fallBowDrawn',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallBowDrawn_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'idleNotch',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleNotch_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'runNotch',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runNotch_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'jumpNotch',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpNotch_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'fallNotch',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallNotch_', 
            suffix: '.png',
            end: 3, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate 
    });
    scene.anims.create({
        key: 'idleHoldLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleHoldLoop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'runHoldLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runHoldLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'jumpHoldLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpHoldLoop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'fallHoldLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallHoldLoop_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'idleRelease',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleRelease_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runRelease',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runRelease_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'jumpRelease',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpRelease_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'fallRelease',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallRelease_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });


    // casting glove magic animations
    scene.anims.create({
        key: 'idleGlove',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleGlove_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'runGlove',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runGlove_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'jumpGlove',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpGlove_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'fallGlove',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallGlove_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'ledgeGrabGlove',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeGrabGlove_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'wallSlideGlove',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideGlove_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });

    //casting animations
    //red
    scene.anims.create({
        key: 'idleCastRed',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleCastRed_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'runCastRed',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runCastRed_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'jumpCastRed',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpCastRed_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'fallCastRed',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallCastRed_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'wallSlideCastRed',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideCastRed_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    // blue magic
    scene.anims.create({
        key: 'idleCastBlue',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'runCastBlue',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'jumpCastBlue',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'fallCastBlue',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallCastBlue_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'wallSlideCastBlue',
        frames: scene.anims.generateFrameNames('characterAtlas', {
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
        key: 'redMagic',
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
        key: 'blueMagic',
        frames: scene.anims.generateFrameNames('magicAtlas', {
            prefix: 'blueMagic_', 
            suffix: '.png',
            end: 20, 
            zeroPad: 2 
            }),
            frameRate: magicFrameRate,
            repeat: -1
    });


    /////////////////////////////////////////////////////////////////////////////////////////////

    scene.player.on('animationcomplete', (animation, frame) => {
        //console.log('in animation complete callback');
        if(animation.key==='idleSwing1' || animation.key==='idleSwing2' || animation.key==='runSwing'){
            scene.playerAttacking = false;
            const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
            scene.player.setPosition(scene.player.x + (10*nudge), scene.player.y);
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
                        emitAnimationEvent(scene, 'idleGlove', false);
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
}

