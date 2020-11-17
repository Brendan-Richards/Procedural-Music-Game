
//import Phaser from 'phaser';
import MountainScene from './MountainScene';

export default (scene: MountainScene) => {
    
    const frameRate = 10;
    const swingFrameRate = 18;
    const magicFrameRate = 30;

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
        key: 'idleSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleSword_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
        }),
        frameRate: frameRate,
        repeat: -1
    });
    scene.anims.create({
        key: 'runSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runSword_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'jumpSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpSword_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'wallSlideSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideSword_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'ledgeGrabSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeGrabSword_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'fallSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallSword_', 
            suffix: '.png',
            end: 2, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
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
        key: 'idleSwordDraw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleSwordDraw_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runSwordDraw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runSwordDraw_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'jumpSwordDraw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpSwordDraw_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'fallSwordDraw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallSwordDraw_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'wallSwordDraw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSwordDraw_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'ledgeSwordDraw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeSwordDraw_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'idleSwordSheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleSwordSheath_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'runSwordSheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runSwordSheath_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'jumpSwordSheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpSwordSheath_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'fallSwordSheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallSwordSheath_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'wallSwordSheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSwordSheath_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
    });
    scene.anims.create({
        key: 'ledgeSwordSheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_ledgeSwordSheath_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: swingFrameRate
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
    scene.anims.create({
        key: 'idleCast',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleCast_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'runCast',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runCast_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'jumpCast',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpCast_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'fallCast',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallCast_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'wallSlideCast',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideCast_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'idleCastLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_idleCastLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'runCastLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runCastLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'jumpCastLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_jumpCastLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'fallCastLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_fallCastLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });
    scene.anims.create({
        key: 'wallSlideCastLoop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_wallSlideCastLoop_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate,
            repeat: -1
    });

    //////////////////////////////////////////////////////////////////////////////////////////
    //magic animations
    scene.anims.create({
        key: 'redMagic',
        frames: scene.anims.generateFrameNames('magicAtlas', {
            prefix: 'redMagic_', 
            suffix: '.png',
            end: 60, 
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
            end: 60, 
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
                case 'idleCast': {
                    if(scene.stopCasting){
                        console.log('idleCast ended')
                        //console.log(animation)
                        scene.player.play('idleCastLoop', true);
                        scene.prevPlayerAnimation = 'idleCast';
                        scene.currentPlayerAnimation = 'idleCastLoop'; 
                        if(!scene.holdingCast){
                            scene.playerAttacking = false;
                        }
                        scene.stopCasting = false;
                        makeMagic(scene);
                    }
                    
                    break;
                }
                case 'runCast': {
                    if(scene.stopCasting){
                        console.log('runCast ended')
                        scene.player.play('runCastLoop', true);
                        scene.prevPlayerAnimation = 'runCast';
                        scene.currentPlayerAnimation = 'runCastLoop'; 
                        if(!scene.holdingCast){
                            scene.playerAttacking = false;
                        }
                        scene.stopCasting = false;
                        makeMagic(scene);
                    }
                    break;
                }
                case 'jumpCast': {
                    if(scene.stopCasting){
                        console.log('jumpCast ended')
                        //console.log(animation)
                        scene.player.play('jumpCastLoop', true);
                        scene.prevPlayerAnimation = 'jumpCast';
                        scene.currentPlayerAnimation = 'jumpCastLoop'; 
                        if(!scene.holdingCast){
                            scene.playerAttacking = false;
                        }
                        scene.stopCasting = false;
                        makeMagic(scene);
                    }
 
                    break;
                }
                case 'fallCast': {
                    if(scene.stopCasting){
                        console.log('fallCast ended')
                        scene.player.play('fallCastLoop', true);
                        scene.prevPlayerAnimation = 'fallCast';
                        scene.currentPlayerAnimation = 'fallCastLoop'; 
                        if(!scene.holdingCast){
                            scene.playerAttacking = false;
                        }
                        scene.stopCasting = false;
                        makeMagic(scene);
                    }
                    break;
                }
                case 'wallSlideCast': {
                    if(scene.stopCasting){
                        console.log('wallSlideCast ended')
                        //console.log(animation)
                        scene.player.play('wallSlideCastLoop', true);
                        scene.prevPlayerAnimation = 'wallSlideCast';
                        scene.currentPlayerAnimation = 'wallSlideCastLoop'; 
                        if(!scene.holdingCast){
                            scene.playerAttacking = false;
                        }
                        scene.stopCasting = false;
                        makeMagic(scene);
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
                    break;
                }
                case 'runNotch': {
                    scene.player.play('runHoldLoop', true);
                    scene.prevPlayerAnimation = 'runNotch';
                    scene.currentPlayerAnimation = 'runHoldLoop'; 
                    break;
                }

                //air bow attacks
                case 'jumpNotch': {
                    scene.player.play('jumpHoldLoop', true);
                    scene.prevPlayerAnimation = 'jumpNotch';
                    scene.currentPlayerAnimation = 'jumpHoldLoop'; 
                    break;
                }
                case 'fallNotch': {
                    scene.player.play('fallHoldLoop', true);
                    console.log('playing fallHoldLoop')
                    scene.prevPlayerAnimation = 'fallNotch';
                    scene.currentPlayerAnimation = 'fallHoldLoop'; 
                    break;
                }
            }
        }
        else if(scene.swordDraws.includes(animation.key)){
            //console.log('done with draw animation');
            scene.drawSword = false;
            scene.swordDrawn = true;
        }
        else if(scene.swordSheaths.includes(animation.key)){
            scene.sheathSword = false;
            scene.swordDrawn = false;
        }
        else if(animation.key==='airSwing3Start'){
            scene.player.play('airSwing3Loop', true);
            scene.prevPlayerAnimation = 'airSwing3Start';
            scene.currentPlayerAnimation = 'airSwing3Loop';
        }

        else if(animation.key==='airSwing3End'){
            scene.downAttack = false;
            scene.playerAttacking = false;
            scene.playerCanJump = true;
        }
    }, scene);

};

const makeMagic = (scene: MountainScene) => {
    //make magic
    let factor = scene.currentPlayerDirection==='left' ? -1 : 1;
    if(scene.prevPlayerAnimation==='wallSlideCast'){
        factor *= -1;
    }
    
    const frameName = scene.magicType==='red' ? 'redMagic_00.png' : 'blueMagic_00.png';

    let yPosition = scene.player.y-6;
    if(['wallSlideCast', 'fallCast'].includes(scene.prevPlayerAnimation)){
        yPosition += 15;
    }

    const magic = scene.matter.add.sprite(scene.player.x+(factor * 25), yPosition, 'magicAtlas', frameName);
    if(scene.currentPlayerDirection==='right'){
        if(scene.prevPlayerAnimation==='wallSlideCast'){
            magic.setFlipX(false);
        }
        else{
            magic.setFlipX(true);
        } 
    }
    if(scene.magicType==='red'){
        magic.play('redMagic', true);
    }
    else{
        magic.play('blueMagic', true);
    }
    
    magic.setCollisionGroup(-1);
    magic.setIgnoreGravity(true);
    magic.setFixedRotation();
    scene.matter.setVelocity(magic, factor * scene.magicSpeed, 0);

    scene.audio.fireballSound.play(scene.audio.fireballSoundConfig);
}