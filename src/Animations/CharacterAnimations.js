
//import Phaser from 'phaser';

export default (scene) => {

    const frameRate = 10;

    scene.anims.create({
        key: 'run',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer-run-', 
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
             prefix: 'adventurer-idle-', 
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
             prefix: 'adventurer-idle-2-', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1 
    });
    // scene.anims.create({
    //     key: 'idle2',
    //     frames: scene.anims.generateFrameNames('characterAtlas', {
    //          prefix: 'adventurer-idle-2-', 
    //          suffix: '.png',
    //          end: 4, 
    //          zeroPad: 2 
    //         }),
    //         frameRate: 10,
    //     repeat: -1 
    // });
};