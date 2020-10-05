
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
    scene.anims.create({
        key: 'jump',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer-jump-', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate+3,
        repeat: 0
    });
    scene.anims.create({
        key: 'fall',
        frames: scene.anims.generateFrameNames('characterAtlas', {
             prefix: 'adventurer-fall-', 
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
             prefix: 'adventurer-smrslt-', 
             suffix: '.png',
             end: 4, 
             zeroPad: 2 
            }),
            frameRate: frameRate,
        repeat: -1,
    });
};