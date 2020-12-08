import MountainScene from './MountainScene';

const loadAssets = (scene: MountainScene) => {
    console.log('in the preload function');
    //background layer
   scene.load.image('grayBackground', './assets/images/background/grayBackground.png');

    //all character sprites
    scene.load.atlas('characterAtlas', 'assets/images/characters/characterAtlasBlue.png', 'assets/json/characterAtlas.json');
    scene.load.atlas('opponentAtlas', 'assets/images/characters/characterAtlasOrange.png', 'assets/json/characterAtlas.json');
    scene.load.json('characterAtlasData', 'assets/json/characterAtlas.json');
    //bounding vertex information for the character
    scene.load.json('characterShapes', 'assets/json/characterVerticies.json');

    //environment sprites
    scene.load.atlas('environmentAtlas', 'assets/images/environment/environmentAtlas.png', 'assets/json/environmentAtlas.json');
    scene.load.json('environmentAtlasData', 'assets/json/environmentAtlas.json'); 
    scene.load.image("arrow", "assets/images/environment/arrowBlue.png");    
    
    //magic
    scene.load.atlas('magicAtlas', 'assets/images/environment/magicBlueOrange.png', 'assets/json/magic.json');
    scene.load.json('magicAtlasData', 'assets/json/magic.json');
    //blood effects
    scene.load.atlas('bloodAtlas', 'assets/images/environment/blood.png', 'assets/json/blood.json');
    scene.load.json('bloodAtlasData', 'assets/json/blood.json');    
    //explosion
    scene.load.atlas('blueExplosionAtlas', 'assets/images/environment/blueExplosion.png', 'assets/json/explosion.json');
    scene.load.atlas('orangeExplosionAtlas', 'assets/images/environment/orangeExplosion.png', 'assets/json/explosion.json');
    scene.load.json('blueExplosionAtlasData', 'assets/json/explosion.json');   

    //audio
    scene.load.audio('floorAmbience', 'assets/audio/floorAmbience.mp3');
    scene.load.audio('steps', 'assets/audio/2step.mp3');
    scene.load.audio('jump', 'assets/audio/swoosh.mp3');
    scene.load.audio('wallSlide', 'assets/audio/wallSlide2.mp3');
    scene.load.audio('wallSmack', 'assets/audio/wallSmack.mp3');
    scene.load.audio('wallJump', 'assets/audio/wallSmack.mp3');
    scene.load.audio('wind', 'assets/audio/windLoop.mp3');
    scene.load.audio('hardLanding', 'assets/audio/landing.mp3');
    scene.load.audio('windFlap', 'assets/audio/windFlap.mp3');
    scene.load.audio('attack', 'assets/audio/attack.mp3');
    scene.load.audio('draw', 'assets/audio/swordDraw.mp3');
    scene.load.audio('sheath', 'assets/audio/swordSheath.mp3');
    scene.load.audio('swordRockImpact', 'assets/audio/swordRockImpact.mp3');
    scene.load.audio('fistWallImpact', 'assets/audio/fistWallImpact.mp3');
    scene.load.audio('punch', 'assets/audio/punch.mp3');
    scene.load.audio('kick', 'assets/audio/kick.mp3');
    scene.load.audio('arrowWallImpact1', 'assets/audio/arrowWallImpact1.mp3');
    scene.load.audio('arrowWallImpact2', 'assets/audio/arrowWallImpact2.mp3');
    scene.load.audio('arrowWallImpact3', 'assets/audio/arrowWallImpact3.mp3');
    scene.load.audio('bowDraw', 'assets/audio/bowDraw.mp3');
    scene.load.audio('bowRelease', 'assets/audio/bowRelease.mp3');
    scene.load.audio('cast', 'assets/audio/fullCast.mp3');
    scene.load.audio('arrowBodyImpact', 'assets/audio/arrowBodyImpact.mp3');
    scene.load.audio('swordSwordImpact', 'assets/audio/swordSwordImpact1.mp3');
    scene.load.audio('swordBodyImpact', 'assets/audio/swordBodyImpact.mp3');
    scene.load.audio('explosion', 'assets/audio/explosion.mp3');

    //UI
    scene.load.image("staminaOutline", "assets/images/UI/staminaOutline.png");
    scene.load.image("staminaFill", "assets/images/UI/staminaFill.png");   
}

export { loadAssets };