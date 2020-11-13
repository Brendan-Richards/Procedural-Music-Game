
//import Phaser from 'phaser';
import MountainScene from './MountainScene';

export default (scene: MountainScene) => {
    
    const frameRate = 10;
    const swingFrameRate = 18;

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
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'punch2',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_punch2_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'punch3',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_punch3_', 
            suffix: '.png',
            end: 5, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'runPunch',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_runPunch_', 
            suffix: '.png',
            end: 7, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'groundKick',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_groundKick_', 
            suffix: '.png',
            end: 8, 
            zeroPad: 2 
            }),
            frameRate: frameRate
    });
    scene.anims.create({
        key: 'airKick',
        frames: scene.anims.generateFrameNames('characterAtlas', {
            prefix: 'adventurer_airKick_', 
            suffix: '.png',
            end: 4, 
            zeroPad: 2 
            }),
            frameRate: frameRate
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

    scene.player.on('animationcomplete', (animation, frame) => {
        //console.log('in animation complete callback');
        if(animation.key==='idleSwing1' || animation.key==='idleSwing2'){
            scene.playerAttacking = false;
            const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
            scene.player.setPosition(scene.player.x + (10*nudge), scene.player.y);
        }
        else if(animation.key==='wallSwing' || animation.key==='airSwing1' || animation.key==='airSwing2' || animation.key==='runSwing'){
            scene.playerAttacking = false;
        }
        else if(scene.swordDraws.includes(animation.key)){
            console.log('done with draw animation');
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






    // scene.anims.create({
    //     key: 'run',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_run_', 
    //          suffix: '.png',
    //          end: 6, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1 
    // });
    // scene.anims.create({
    //     key: 'runSword',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_run3_', 
    //          suffix: '.png',
    //          end: 6, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1 
    // });
    // scene.anims.create({
    //     key: 'idle1',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_idle_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1 
    // });
    // scene.anims.create({
    //     key: 'idleSword',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_idle_2_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1 
    // });
    // scene.anims.create({
    //     key: 'jump',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_jump_up_', 
    //          suffix: '.png',
    //          start: 0,
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1
    // });
    // scene.anims.create({
    //     key: 'jumpSword',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_jump_up_swrd_', 
    //          suffix: '.png',
    //          start: 0,
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1
    // });
    // scene.anims.create({
    //     key: 'groundSlide',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_slide_', 
    //          suffix: '.png',
    //          start: 0,
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1
    // });
    // scene.anims.create({
    //     key: 'fall',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_fall_', 
    //          suffix: '.png',
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1,
    // });
    // scene.anims.create({
    //     key: 'fallSword',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_swrd_fall_', 
    //          suffix: '.png',
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1,
    // });
    // scene.anims.create({
    //     key: 'wallSlide',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_wall_slide_', 
    //          suffix: '.png',
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1,
    // });
    // scene.anims.create({
    //     key: 'wallAttack',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_wall_attack_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.5
    // });
    // scene.anims.create({
    //     key: 'wallSlideSword',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_wall_slide_swrd_', 
    //          suffix: '.png',
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1,
    // });
    // scene.anims.create({
    //     key: 'smrslt',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_smrslt_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1,
    // });
    // scene.anims.create({
    //     key: 'ledgeGrab',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_crnr_grb_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1 
    // });
    // scene.anims.create({
    //     key: 'ledgeGrabSword',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_crnr_grb_swrd_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate,
    //     repeat: -1 
    // });
    // scene.anims.create({
    //     key: 'ledgeClimb',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_crnr_clmb_', 
    //          suffix: '.png',
    //          end: 5, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate*1.5,
    //     // repeat: 1
    // });
    // scene.anims.create({
    //     key: 'attack1',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_attack1_', 
    //          suffix: '.png',
    //          end: 5, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'attack2',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_attack2_', 
    //          suffix: '.png',
    //          end: 6, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'attack3',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_attack3_', 
    //          suffix: '.png',
    //          end: 6, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'airAttack1',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_air_attack1_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'airAttack2',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_air_attack2_', 
    //          suffix: '.png',
    //          end: 3, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'airAttack3Start',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_air_attack3_rdy_', 
    //          suffix: '.png',
    //          end: 1, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'airAttack3Loop',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_air_attack3_loop_', 
    //          suffix: '.png',
    //          end: 2, 
    //          zeroPad: 2 
    //         }),
    //         repeat: -1,
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'airAttack3End',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_air_attack_3_end_', 
    //          suffix: '.png',
    //          end: 3, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'draw',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_swrd_drw_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'drawAir',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_swrd_drw_air_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'sheath',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_swrd_shte_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });
    // scene.anims.create({
    //     key: 'sheathAir',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer_swrd_shte_air_', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: frameRate * 1.8
    // });

    // scene.player.on('animationcomplete', (animation, frame) => {
    //     //console.log('in animation complete callback');
    //     if(animation.key==='ledgeClimb'){
    //         scene.playerLedgeClimb = false;
    //     } 
    //     else if(animation.key==='attack1' || 
    //             animation.key==='attack2' ||
    //             animation.key==='attack3'){
    //         scene.playerAttacking = false;
    //         const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
    //         scene.player.setPosition(scene.player.x + (10*nudge), scene.player.y);
    //     }
    //     else if(animation.key==='wallAttack'){
    //         scene.playerAttacking = false;
    //         //c onst nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
    //         //scene.player.setPosition(scene.player.x - (500), scene.player.y);
    //     }else if(animation.key==='airAttack1' ||
    //              animation.key==='airAttack2' || 
    //              animation.key==='airAttack3End'){
    //         scene.playerAttacking = false;
    //     }
    //     else if(animation.key==='draw' || animation.key==='drawAir'){
    //         scene.drawSword = false;
    //         scene.swordDrawn = true;
    //     }
    //     else if(animation.key==='sheath' || animation.key==='sheathAir'){
    //         scene.sheathSword = false;
    //         scene.swordDrawn = false;
    //     }
    //     else if(animation.key==='airAttack3Start'){
    //         scene.player.play('airAttack3Loop', true);
    //         scene.prevPlayerAnimation = 'airAttack3Start';
    //         scene.currentPlayerAnimation = 'airAttack3Loop';
    //     }
    //     else if(animation.key==='airAttack3End'){
    //         scene.downAttack = false;
    //         scene.playerAttacking = false;
    //         scene.playerCanJump = true;
    //     }
    //     // else if(animation.key==='wallSlide'){
    //     //     scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y}; 
    //     // }
    //     // scene.player.on('animationupdate-wallAttack', () => {
    //     //     scene.player.setPosition(scene.stopWallSlidingPosition.x, scene.player.y);
    //     // })
        
    // }, scene);
};