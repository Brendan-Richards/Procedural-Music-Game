import Phaser from 'phaser';
import MountainScene from './MountainScene';
import * as mm from '@magenta/music/es6';

class Audio {

    //sound effects
    runSound: Phaser.Sound.BaseSound;
    jumpSound: Phaser.Sound.BaseSound;
    wallJumpSound: Phaser.Sound.BaseSound;
    wallSlideSound: Phaser.Sound.BaseSound;
    windSound: Phaser.Sound.BaseSound;
    floorAmbience: Phaser.Sound.BaseSound;
    softLanding: Phaser.Sound.BaseSound;
    hardLanding: Phaser.Sound.BaseSound;
    windFlap: Phaser.Sound.BaseSound;
    wallSmackSound: Phaser.Sound.BaseSound;
    swordSwingSound: Phaser.Sound.BaseSound;
    swordRockImpact: Phaser.Sound.BaseSound;;
    drawSound: Phaser.Sound.BaseSound;
    sheathSound: Phaser.Sound.BaseSound;
    punchSound: Phaser.Sound.BaseSound;
    fistWallImpact: Phaser.Sound.BaseSound;
    kickSound: Phaser.Sound.BaseSound;
    bowDrawSound: Phaser.Sound.BaseSound;
    bowReleaseSound: Phaser.Sound.BaseSound;
    arrowWallImpact1: Phaser.Sound.BaseSound;
    arrowWallImpact2: Phaser.Sound.BaseSound;
    arrowWallImpact3: Phaser.Sound.BaseSound;
    castSound: Phaser.Sound.BaseSound;
    arrowBodyImpact: Phaser.Sound.BaseSound;
    swordSwordImpact: Phaser.Sound.BaseSound;
    swordBodyImpact: Phaser.Sound.BaseSound;
    swordBodyImpactConfig: object;
    arrowBodyImpactConfig: object;
    swordSwordImpactConfig: object;
    castSoundConfig: object;
    bowDrawSoundConfig: object;
    bowReleaseSoundConfig: object;
    arrowWallImpact1Config: object;
    arrowWallImpact2Config: object;
    arrowWallImpact3Config: object;
    kickSoundConfig: object;
    fistWallImpactConfig: object;
    punchSoundConfig: object;
    sheathSoundConfig: object;
    wallSmackConfig: object;
    softLandingConfig: object;
    hardLandingConfig: object;
    windConfig: object;
    runConfig: object;
    floorAmbienceConfig: object;
    jumpConfig: object;
    windFlapConfig: object;
    swordRockImpactConfig: object;
    wallSlideConfig: object;
    attackSoundConfig: object;
    drawSoundConfig: object;
    possibleNotes: Array<number>;
    scene: MountainScene;
    

    //music
    musicReady: boolean;
    musicRNN: mm.MusicRNN;
    player: mm.SoundFontPlayer;

    constructor(scene: MountainScene){
        this.scene = scene;
        this.runSound = scene.sound.add('steps');
        this.jumpSound = scene.sound.add('jump');
        this.wallSlideSound = scene.sound.add('wallSlide');
        this.floorAmbience = scene.sound.add('floorAmbience');
        this.windSound = scene.sound.add('wind');
        this.softLanding = scene.sound.add('jump');
        this.hardLanding = scene.sound.add('hardLanding');
        this.wallSmackSound = scene.sound.add('wallSmack');
        this.wallJumpSound = scene.sound.add('jump');
        this.windFlap = scene.sound.add('windFlap');
        this.swordSwingSound = scene.sound.add('attack');
        this.drawSound = scene.sound.add('draw');
        this.sheathSound = scene.sound.add('sheath');
        this.swordRockImpact = scene.sound.add('swordRockImpact');
        this.fistWallImpact = scene.sound.add('fistWallImpact');
        this.punchSound = scene.sound.add('punch');
        this.kickSound = scene.sound.add('kick');
        this.bowDrawSound = scene.sound.add('bowDraw');
        this.bowReleaseSound = scene.sound.add('bowRelease');
        this.arrowWallImpact1 = scene.sound.add('arrowWallImpact1');
        this.arrowWallImpact2 = scene.sound.add('arrowWallImpact2');
        this.arrowWallImpact3 = scene.sound.add('arrowWallImpact3');
        this.castSound = scene.sound.add('cast');
        this.arrowBodyImpact = scene.sound.add('arrowBodyImpact');
        this.swordSwordImpact = scene.sound.add('swordSwordImpact');
        this.swordBodyImpact = scene.sound.add('swordBodyImpact');

        this.swordBodyImpactConfig = {
            loop: false,
            volume: 0.1
        }
        this.arrowBodyImpactConfig = {
            loop: false,
            volume: 0.1
        }
        this.swordSwordImpactConfig = {
            loop: false,
            volume: 0.1
        }
        this.castSoundConfig = {
            loop: false,
            volume: 0.1
        }
        this.bowDrawSoundConfig = {
            loop: false,
            volume: 0.5
        }
        this.bowReleaseSoundConfig = {
            loop: false,
            volume: 0.1
        }
        this.arrowWallImpact1Config = {
            loop: false,
            volume: 0.1
        }
        this.arrowWallImpact2Config = {
            loop: false,
            volume: 0.1
        }
        this.arrowWallImpact3Config = {
            loop: false,
            volume: 0.1
        }
        this.kickSoundConfig = {
            loop: false,
            volume: 0.1
        }
        this.fistWallImpactConfig = {
            loop: false,
            volume: 0.1
        }
        this.punchSoundConfig = {
            loop: false,
            volume: 0.1
        }
        this.swordRockImpactConfig = {
            loop: false,
            volume: 0.13
        }
        this.sheathSoundConfig = {
            loop: false,
            volume: 0.05
        }
        this.drawSoundConfig = {
            loop: false,
            volume: 0.05
        }
        this.attackSoundConfig = {
            loop: false,
            volume: 0.1
        }
        this.windFlapConfig = {
            loop: true,
            volume: 0.2
        }
        this.wallSmackConfig = {
            loop: false,
            volume: 0.1
        }
        this.softLandingConfig = {
            loop: false,
            volume: 0.1
        }
        this.hardLandingConfig = {
            loop: false,
            volume: 0.2
        }
        this.runConfig = {
            loop: true,
            volume: 0.1
        }
        this.jumpConfig = {
            loop: false,
            volume: 0.2
        }
        this.floorAmbienceConfig = {
            loop: true,
            volume: 1
        }
        this.wallSlideConfig = {
            loop:true,
            volume: 0.1
        }
        this.windConfig = {
            loop: true,
            volume: 0
        }


        this.scene.player.on('animationstart', (animation, frame) => {
            
            if(animation.key==='idleSwing1' || animation.key==='idleSwing2' || animation.key==='runSwing'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();
                this.swordSwingSound.play(this.attackSoundConfig);
                const nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
                scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y);
                scene.swordCollided = false;
            }
            else if(scene.bowAttacks.includes(animation.key)){
                scene.playerFriction = 0;
                switch(animation.key){
                    case 'idleHoldLoop':
                    case 'jumpHoldLoop':
                    case 'fallHoldLoop': {
                        if(this.runSound.isPlaying){
                            this.runSound.stop();
                        }
                        break;
                    }
                    case 'jumpNotch':
                    case 'fallNotch':
                    case 'idleNotch': {
                        if(this.runSound.isPlaying){
                            this.runSound.stop();
                        }            
                    }
                    case 'runNotch': {
                        this.bowDrawSound.play(this.bowDrawSoundConfig);
                        break;
                    }
                    case 'idleRelease':
                    case 'runRelease':
                    case 'jumpRelease':
                    case 'fallRelease': {
                        if(this.bowDrawSound.isPlaying){
                            this.bowDrawSound.stop();
                        }
                        this.bowReleaseSound.play(this.bowReleaseSoundConfig);

                        //make arrow
                        makePlayerArrow(scene);

                        break;
                    }
                }
            }
            else if(scene.magicAttacks.includes(animation.key)){
                switch(animation.key){
                    case 'runCastRed':
                    case 'jumpCastRed':
                    case 'fallCastRed':
                    case 'wallSlideCastRed':
                    case 'idleCastRed':
                    case 'runCastBlue':
                    case 'jumpCastBlue':
                    case 'fallCastBlue':
                    case 'wallSlideCastBlue':
                    case 'idleCastBlue': {
                        //console.log('in precast animation callback, current player animation is:', scene.currentPlayerAnimation);
                        if(!this.castSound.isPlaying && !scene.casts.includes(scene.currentPlayerAnimation)){
                            this.castSound.play(this.castSoundConfig);
                        }
                        break;
                    }
                }                
            }
            else if(scene.meeleeAttacks.includes(animation.key)){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();
                if(animation.key==='groundKick' || animation.key==='airKick'){
                    this.kickSound.play(this.kickSoundConfig);
                }
                else{
                    this.punchSound.play(this.attackSoundConfig);
                }
                //const nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
                //scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y);
                //scene.swordCollided = false;
            }  
            else if(animation.key==='wallSwing'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.swordSwingSound.play(this.attackSoundConfig);
                const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
                console.log('setting stop wall slide position');
                scene.swordCollided = false;
                //scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y); 
                 
            }
            else if(animation.key==='airSwing1' || animation.key==='airSwing2'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();
                this.swordSwingSound.play(this.attackSoundConfig);
                scene.swordCollided = false;
            }  
            else if(animation.key==='airSwing3Loop'){
                this.windFlap.play(this.windFlapConfig);
            }
            else if(animation.key==='airSwing3End'){
                this.windFlap.stop();
                this.swordRockImpact.play(this.swordRockImpactConfig);
            }
            else if(animation.key==='run' || animation.key==='runSword' || animation.key==='runSwordDrawn' || animation.key==='runBowDrawn' || animation.key==='runGlove'){
                if(!this.runSound.isPlaying){
                    this.runSound.play(this.runConfig); 
                }               
                this.wallSlideSound.stop();
                this.windFlap.stop();
            } 
            else if(animation.key==='jump' || animation.key==='jumpSwordDrawn' || animation.key==='jumpBowDrawn' || animation.key==='jumpGlove'){
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.windFlap.stop();
                if(!this.jumpSound.isPlaying){
                    this.jumpSound.play(this.jumpConfig);
                }                
            } 
            else if(animation.key==='wallJump'){
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.windFlap.stop();
                this.wallJumpSound.play(this.jumpConfig);               
            }
            else if(animation.key==='fall' || animation.key==='fallSword' || animation.key==='fallSwordDrawn' || animation.key==='fallBowDrawn' || animation.key==='fallGlove'){
                this.runSound.stop();
                this.wallSlideSound.stop();               
            }   
            else if(animation.key==='ledgeGrab' || animation.key==='ledgeGrabSword' || animation.key==='ledgeGrabSwordDrawn' || animation.key==='ledgeGrabBowDrawn' || animation.key==='ledgeGrabGlove'){
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.windFlap.stop();
                this.wallSmackSound.play(this.wallSmackConfig);               
            }    
            else if(animation.key==='wallSlide' || animation.key==='wallSlideSword' || animation.key==='wallSlideSwordDrawn' || animation.key==='wallSlideBowDrawn' || animation.key==='wallSlideGlove'){
                this.runSound.stop();
                this.windFlap.stop();
                if(!this.wallSmackSound.isPlaying && scene.currentPlayerAnimation!=='wallSwing'){
                    this.wallSmackSound.play(this.wallSmackConfig);
                }
                this.wallSlideSound.play(this.wallSlideConfig);  
                //console.log('in hook for wall slide anim start')
                if(scene.currentPlayerAnimation==='wallSwing'){
                    //console.log('previous anim was wall attack')
                    scene.player.setPosition(scene.stopWallSlidingPosition.x, scene.player.y);
                }             
            }
            else if(animation.key==='idle' || animation.key==='idleSword' || animation.key==='idleSwordDrawn' || animation.key==='idleBowDrawn' || animation.key==='idleGlove'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();              
            }      
        });

        //music
        this.musicReady = false;
        this.player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander');
        this.musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
        // this.musicRNN.initialize().then(() => {
        //     this.player.loadAllSamples().then(() => { this.musicReady = true; console.log('music is ready'); });
        // });
        // this.minNote = 20;
        // this.maxNote = 100;
        //notes for Emajor
        this.possibleNotes = [28, 40, 52, 64, 76, 88, 30, 42, 54, 66, 78, 90, 32, 44, 56, 68, 80, 92, 33, 45, 57, 69, 81, 92, 35, 47, 59, 71, 83, 95, 25, 37, 49, 61, 73, 85, 27, 39, 51, 63, 75, 87];
    }

    ambience = () => {
        this.floorAmbience.play(this.floorAmbienceConfig);
        this.windSound.play(this.windConfig);
    }

    randomChoice = (choices: Array<any>): any => {
        const index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }

}

const makePlayerArrow = (scene: MountainScene) => {
    scene.playerAttacking = false;

    const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
    const arrowX = scene.player.x+(factor * 30);
    const arrowY = scene.player.y-6;
    const flipX = scene.currentPlayerDirection==='left';

    scene.socket.emit('createArrow', {
        factor: factor,
        flipX: flipX, 
        x: arrowX,
        y: arrowY
    });

    const arrow = scene.matter.add.sprite(arrowX, arrowY, 'arrow', undefined);
    arrow.setScale(scene.arrowScale);
    
    if(flipX){
        arrow.setFlipX(true);
    }
    arrow.setCollisionGroup(-1);
    arrow.setIgnoreGravity(true);
    arrow.setFixedRotation();
    scene.matter.setVelocity(arrow, factor * scene.arrowSpeed, 0);
}

export default Audio;
