
//import Phaser from 'phaser';
import MountainScene from './MountainScene';

export default (scene: MountainScene) => {
    
    const frameRate = 10;

    scene.anims.create({
        key: 'run',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_run_', 
             suffix: '.png',
             end: 6, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'runSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_run3_', 
             suffix: '.png',
             end: 6, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'idle1',
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
        key: 'idleSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_idle_2_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'jump',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_jump_up_', 
             suffix: '.png',
             start: 0,
             end: 2, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1
    });
    scene.anims.create({
        key: 'jumpSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_jump_up_swrd_', 
             suffix: '.png',
             start: 0,
             end: 2, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1
    });
    scene.anims.create({
        key: 'groundSlide',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_slide_', 
             suffix: '.png',
             start: 0,
             end: 2, 
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
        repeat: -1,
    });
    scene.anims.create({
        key: 'fallSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_swrd_fall_', 
             suffix: '.png',
             end: 2, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1,
    });
    scene.anims.create({
        key: 'wallSlide',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_wall_slide_', 
             suffix: '.png',
             end: 2, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1,
    });
    scene.anims.create({
        key: 'wallAttack',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_wall_attack_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.5
    });
    scene.anims.create({
        key: 'wallSlideSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_wall_slide_swrd_', 
             suffix: '.png',
             end: 2, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1,
    });
    scene.anims.create({
        key: 'smrslt',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_smrslt_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1,
    });
    scene.anims.create({
        key: 'ledgeGrab',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_crnr_grb_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'ledgeGrabSword',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_crnr_grb_swrd_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    scene.anims.create({
        key: 'ledgeClimb',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_crnr_clmb_', 
             suffix: '.png',
             end: 5, 
             zeroPad: 2 
            }),
            frameRate: frameRate*1.5,
        // repeat: 1
    });
    scene.anims.create({
        key: 'attack1',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_attack1_', 
             suffix: '.png',
             end: 5, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'attack2',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_attack2_', 
             suffix: '.png',
             end: 6, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'attack3',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_attack3_', 
             suffix: '.png',
             end: 6, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'airAttack1',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_air_attack1_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'airAttack2',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_air_attack2_', 
             suffix: '.png',
             end: 3, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'airAttack3Start',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_air_attack3_rdy_', 
             suffix: '.png',
             end: 1, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'airAttack3Loop',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_air_attack3_loop_', 
             suffix: '.png',
             end: 2, 
             zeroPad: 2 
            }),
            repeat: -1,
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'airAttack3End',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_air_attack_3_end_', 
             suffix: '.png',
             end: 3, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'draw',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_swrd_drw_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'drawAir',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_swrd_drw_air_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'sheath',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_swrd_shte_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });
    scene.anims.create({
        key: 'sheathAir',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer_swrd_shte_air_', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate * 1.8
    });

    scene.player.on('animationcomplete', (animation, frame) => {
        //console.log('in animation complete callback');
        if(animation.key==='ledgeClimb'){
            scene.playerLedgeClimb = false;
        } 
        else if(animation.key==='attack1' || 
                animation.key==='attack2' ||
                animation.key==='attack3'){
            scene.playerAttacking = false;
            const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
            scene.player.setPosition(scene.player.x + (10*nudge), scene.player.y);
        }
        else if(animation.key==='wallAttack'){
            scene.playerAttacking = false;
            //c onst nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
            //scene.player.setPosition(scene.player.x - (500), scene.player.y);
        }else if(animation.key==='airAttack1' ||
                 animation.key==='airAttack2' || 
                 animation.key==='airAttack3End'){
            scene.playerAttacking = false;
        }
        else if(animation.key==='draw' || animation.key==='drawAir'){
            scene.drawSword = false;
            scene.swordDrawn = true;
        }
        else if(animation.key==='sheath' || animation.key==='sheathAir'){
            scene.sheathSword = false;
            scene.swordDrawn = false;
        }
        else if(animation.key==='airAttack3Start'){
            scene.player.play('airAttack3Loop', true);
            scene.prevPlayerAnimation = 'airAttack3Start';
            scene.currentPlayerAnimation = 'airAttack3Loop';
        }
        else if(animation.key==='airAttack3End'){
            scene.downAttack = false;
            scene.playerAttacking = false;
            scene.playerCanJump = true;
        }
        // else if(animation.key==='wallSlide'){
        //     scene.stopWallSlidingPosition = {x: scene.player.x, y: scene.player.y}; 
        // }
        // scene.player.on('animationupdate-wallAttack', () => {
        //     scene.player.setPosition(scene.stopWallSlidingPosition.x, scene.player.y);
        // })
        
    }, scene);
};