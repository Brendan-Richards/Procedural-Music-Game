
//import Phaser from 'phaser';

export default (scene) => {

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
        key: 'idle2',
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
};