import Phaser from 'phaser';
import MountainScene from './MountainScene';
import { setCollisionMask } from './Collisions';
import * as mm from '@magenta/music/es6';

interface sound {
    sound: Phaser.Sound.BaseSound,
    config: {
        loop: boolean,
        volume: number
    }
}

class Audio {

    //sound effects
    runSound: sound;
    jumpSound: sound;
    wallJumpSound: sound;
    wallSlideSound: sound;
    windSound: sound;
    floorAmbience: sound;
    softLanding: sound;
    hardLanding: sound;
    windFlap: sound;
    wallSmackSound: sound;
    swordSwingSound: sound;
    swordRockImpact: sound;;
    drawSound: sound;
    sheathSound: sound;
    punchSound: sound;
    fistWallImpact: sound;
    kickSound: sound;
    bowDrawSound: sound;
    bowReleaseSound: sound;
    arrowWallImpact1: sound;
    arrowWallImpact2: sound;
    arrowWallImpact3: sound;
    castSound: sound;
    arrowBodyImpact: sound;
    swordSwordImpact: sound;
    swordBodyImpact: sound;
    explosionSound: sound;
    possibleNotes: Array<number>;
    scene: MountainScene;

    //music
    musicReady: boolean;
    musicRNN: mm.MusicRNN;
    player: mm.SoundFontPlayer;

    constructor(scene: MountainScene){
        this.scene = scene;

        this.explosionSound = {
			sound: scene.sound.add('explosion'),
			config: {
                loop: false,
                volume: 0.2
            }
		}
        this.runSound = {
			sound: scene.sound.add('steps'),
			config: {
                loop: true,
                volume: 0.1
            }
		}
		this.jumpSound = {
			sound: scene.sound.add('jump'),
			config: {
                loop: false,
                volume: 0.2
            }
		}
		this.wallSlideSound = {
			sound: scene.sound.add('wallSlide'),
			config: {
                loop:true,
                volume: 0.1
            }
		}
		this.floorAmbience = {
			sound: scene.sound.add('floorAmbience'),
			config: {
                loop: true,
                volume: 1
            }
		}
		this.windSound = {
			sound: scene.sound.add('wind'),
			config: {
                loop: true,
                volume: 0
            }
		}
		this.softLanding = {
			sound: scene.sound.add('jump'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.hardLanding = {
			sound: scene.sound.add('hardLanding'),
			config: {
                loop: false,
                volume: 0.2
            }
		}
		this.wallSmackSound = {
			sound: scene.sound.add('wallSmack'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.wallJumpSound = {
			sound: scene.sound.add('jump'),
			config: {
                loop: false,
                volume: 0.2
            } 
		}
		this.windFlap = {
			sound: scene.sound.add('windFlap'),
			config: {
                loop: true,
                volume: 0.2
            }
		}
		this.swordSwingSound = {
			sound: scene.sound.add('attack'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.drawSound = {
			sound: scene.sound.add('draw'),
			config: {
                loop: false,
                volume: 0.05
            }
		}
		this.sheathSound = {
			sound: scene.sound.add('sheath'),
			config: {
                loop: false,
                volume: 0.05
            }
		}
		this.swordRockImpact = {
			sound: scene.sound.add('swordRockImpact'),
			config: {
                loop: false,
                volume: 0.13
            }
		}
		this.fistWallImpact = {
			sound: scene.sound.add('fistWallImpact'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.punchSound = {
			sound: scene.sound.add('punch'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.kickSound = {
			sound: scene.sound.add('kick'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.bowDrawSound = {
			sound: scene.sound.add('bowDraw'),
			config: {
                loop: false,
                volume: 0.5
            }
		}
		this.bowReleaseSound = {
			sound: scene.sound.add('bowRelease'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.arrowWallImpact1 = {
			sound: scene.sound.add('arrowWallImpact1'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.arrowWallImpact2 = {
			sound: scene.sound.add('arrowWallImpact2'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.arrowWallImpact3 = {
			sound: scene.sound.add('arrowWallImpact3'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.castSound = {
			sound: scene.sound.add('cast'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.arrowBodyImpact = {
			sound: scene.sound.add('arrowBodyImpact'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.swordSwordImpact = {
			sound: scene.sound.add('swordSwordImpact'),
			config: {
                loop: false,
                volume: 0.1
            }
		}
		this.swordBodyImpact = {
			sound: scene.sound.add('swordBodyImpact'),
			config: {
                loop: false,
                volume: 0.05
            }
		}
    }

    ambience = () => {
        this.floorAmbience.sound.play(this.floorAmbience.config);
        this.windSound.sound.play(this.windSound.config);
    }

    randomChoice = (choices: Array<any>): any => {
        const index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }

    startAnimationAudio = (scene: MountainScene) => {
        this.scene.player.on('animationstart', (animation, frame) => {
            
            if(animation.key==='idleSwing1' || animation.key==='idleSwing2' || animation.key==='runSwing'){
                this.runSound.sound.stop(); 
                this.windFlap.sound.stop();
                this.wallSlideSound.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);
                this.swordSwingSound.sound.play(this.swordSwingSound.config);
                scene.socket.emit('playerSound', {name: 'swordSwingSound', x: scene.player.x, y: scene.player.y});
                //const nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
                //scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y);
                scene.swordCollided = false;
            }
            else if(scene.bowAttacks.includes(animation.key)){
                scene.playerFriction = 0;
                switch(animation.key){
                    case 'idleHoldLoop':
                    case 'jumpHoldLoop':
                    case 'fallHoldLoop': {
                        if(this.runSound.sound.isPlaying){
                            this.runSound.sound.stop();
                            scene.socket.emit('playerSoundStop', ['runSound']);
                        }
                        break;
                    }
                    case 'jumpNotch':
                    case 'fallNotch':
                    case 'idleNotch': {
                        if(this.runSound.sound.isPlaying){
                            this.runSound.sound.stop();
                            scene.socket.emit('playerSoundStop', ['runSound']);
                        }            
                    }
                    case 'runNotch': {
                        this.bowDrawSound.sound.play(this.bowDrawSound.config);
                        scene.socket.emit('playerSound', {name: 'bowDrawSound', x: scene.player.x, y: scene.player.y});
                        break;
                    }
                    case 'idleRelease':
                    case 'runRelease':
                    case 'jumpRelease':
                    case 'fallRelease': {
                        if(this.bowDrawSound.sound.isPlaying){
                            this.bowDrawSound.sound.stop();
                            scene.socket.emit('playerSoundStop', ['bowDrawSound']);
                        }
                        this.bowReleaseSound.sound.play(this.bowReleaseSound.config);
                        scene.socket.emit('playerSound', {name: 'bowReleaseSound', x: scene.player.x, y: scene.player.y});

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
                        if(!this.castSound.sound.isPlaying && !scene.casts.includes(scene.currentPlayerAnimation)){
                            this.castSound.sound.play(this.castSound.config);
                            scene.socket.emit('playerSound', {name: 'castSound', x: scene.player.x, y: scene.player.y});
                        }
                        break;
                    }
                }                
            }
            else if(scene.meeleeAttacks.includes(animation.key)){
                this.runSound.sound.stop(); 
                this.windFlap.sound.stop();
                this.wallSlideSound.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);
                if(animation.key==='groundKick' || animation.key==='airKick'){
                    this.kickSound.sound.play(this.kickSound.config);
                    scene.socket.emit('playerSound', {name: 'kickSound', x: scene.player.x, y: scene.player.y});
                }
                else{
                    this.punchSound.sound.play(this.punchSound.config);
                    scene.socket.emit('playerSound', {name: 'punchSound', x: scene.player.x, y: scene.player.y});
                }
                //const nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
                //scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y);
                //scene.swordCollided = false;
            }  
            else if(animation.key==='wallSwing'){
                this.runSound.sound.stop(); 
                this.windFlap.sound.stop();
                this.swordSwingSound.sound.play(this.swordSwingSound.config);
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'swordSwingSound']);
                scene.socket.emit('playerSound', {name: 'swordSwingSound', x: scene.player.x, y: scene.player.y});
                console.log('setting stop wall slide position');
                scene.swordCollided = false;
                //scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y); 
                 
            }
            else if(animation.key==='airSwing1' || animation.key==='airSwing2'){
                this.runSound.sound.stop(); 
                this.windFlap.sound.stop();
                this.wallSlideSound.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);
                this.swordSwingSound.sound.play(this.swordSwingSound.config);
                scene.socket.emit('playerSound', {name: 'swordSwingSound', x: scene.player.x, y: scene.player.y});
                scene.swordCollided = false;
            }  
            else if(animation.key==='airSwing3Loop'){
                this.windFlap.sound.play(this.windFlap.config);
                scene.socket.emit('playerSound', {name: 'windFlap', x: scene.player.x, y: scene.player.y});
            }
            else if(animation.key==='airSwing3End'){
                this.windFlap.sound.stop();
                scene.socket.emit('playerSoundStop', ['windFlap']);
                this.swordRockImpact.sound.play(this.swordRockImpact.config);
                scene.socket.emit('playerSound', {name: 'swordRockImpact', x: scene.player.x, y: scene.player.y});
            }
            else if(animation.key==='run' || animation.key==='runSword' || animation.key==='runSwordDrawn' || animation.key==='runBowDrawn' || animation.key==='runGlove'){
                if(!this.runSound.sound.isPlaying){
                    this.runSound.sound.play(this.runSound.config); 
                    scene.socket.emit('playerSound', {name: 'runSound', x: scene.player.x, y: scene.player.y});
                }               
                this.wallSlideSound.sound.stop();
                this.windFlap.sound.stop();
                scene.socket.emit('playerSoundStop', ['windFlap', 'wallSlideSound']);
            } 
            else if(animation.key==='jump' || animation.key==='jumpSwordDrawn' || animation.key==='jumpBowDrawn' || animation.key==='jumpGlove'){
                this.runSound.sound.stop();
                this.wallSlideSound.sound.stop();
                this.windFlap.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);
                if(!this.jumpSound.sound.isPlaying){
                    this.jumpSound.sound.play(this.jumpSound.config);
                    scene.socket.emit('playerSound', {name: 'jumpSound', x: scene.player.x, y: scene.player.y});
                }                
            } 
            else if(animation.key==='wallJump'){
                this.runSound.sound.stop();
                this.wallSlideSound.sound.stop();
                this.windFlap.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);
                this.wallJumpSound.sound.play(this.jumpSound.config);     
                scene.socket.emit('playerSound', {name: 'wallJumpSound', x: scene.player.x, y: scene.player.y});          
            }
            else if(animation.key==='fall' || animation.key==='fallSword' || animation.key==='fallSwordDrawn' || animation.key==='fallBowDrawn' || animation.key==='fallGlove'){
                this.runSound.sound.stop();
                this.wallSlideSound.sound.stop();   
                scene.socket.emit('playerSoundStop', ['runSound', 'wallSlideSound']);            
            }   
            else if(animation.key==='ledgeGrab' || animation.key==='ledgeGrabSword' || animation.key==='ledgeGrabSwordDrawn' || animation.key==='ledgeGrabBowDrawn' || animation.key==='ledgeGrabGlove'){
                this.runSound.sound.stop();
                this.wallSlideSound.sound.stop();
                this.windFlap.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);
                this.wallSmackSound.sound.play(this.wallSmackSound.config);  
                scene.socket.emit('playerSound', {name: 'wallSmackSound', x: scene.player.x, y: scene.player.y});             
            }    
            else if(animation.key==='wallSlide' || animation.key==='wallSlideSword' || animation.key==='wallSlideSwordDrawn' || animation.key==='wallSlideBowDrawn' || animation.key==='wallSlideGlove'){
                this.runSound.sound.stop();
                this.windFlap.sound.stop();
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap']);
                if(!this.wallSmackSound.sound.isPlaying && scene.currentPlayerAnimation!=='wallSwing'){
                    this.wallSmackSound.sound.play(this.wallSmackSound.config);
                    scene.socket.emit('playerSound', {name: 'wallSmackSound', x: scene.player.x, y: scene.player.y});
                }
                this.wallSlideSound.sound.play(this.wallSlideSound.config);  
                scene.socket.emit('playerSound', {name: 'wallSlideSound', x: scene.player.x, y: scene.player.y});
                //console.log('in hook for wall slide anim start')
                if(scene.currentPlayerAnimation==='wallSwing'){
                    //console.log('previous anim was wall attack')
                    scene.player.setPosition(scene.stopWallSlidingPosition.x, scene.player.y);
                }             
            }
            else if(animation.key==='idle' || animation.key==='idleSword' || animation.key==='idleSwordDrawn' || animation.key==='idleBowDrawn' || animation.key==='idleGlove'){
                this.runSound.sound.stop(); 
                this.windFlap.sound.stop();
                this.wallSlideSound.sound.stop();    
                scene.socket.emit('playerSoundStop', ['runSound', 'windFlap', 'wallSlideSound']);          
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

}

const makePlayerArrow = (scene: MountainScene) => {
    scene.playerAttacking = false;

    const factor = scene.currentPlayerDirection==='left' ? -1 : 1;
    const arrowX = scene.player.x+(factor * 5);
    const arrowY = scene.player.y-2;
    const flipX = scene.currentPlayerDirection==='left';

    scene.socket.emit('createArrow', {
        factor: factor,
        flipX: flipX, 
        x: arrowX,
        y: arrowY
    });

    const arrow = scene.matter.add.sprite(arrowX, arrowY, 'arrow', undefined);
    arrow.setScale(scene.arrowScale);
    //console.log('player arrow object right after creation:', arrow); 

    arrow.body.label = 'playerArrow';
    arrow.body.collisionFilter.category = scene.collisionCategories.playerArrow;
    setCollisionMask(scene, arrow, ['player', 'playerBox', 'playerArrow', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);

    scene.playerArrows.push(arrow);

    if(scene.playerArrows.length > scene.maxArrows){
        const oldest = scene.playerArrows.shift();
        oldest.destroy();
    }
    
    if(flipX){
        arrow.setFlipX(true);
    }

    //console.log(scene.playerArrows);
    //console.log('arrow:', arrow);
    // arrow.setCollisionCategory(scene.playerMask);
    // arrow.setCollidesWith(scene.opponentMask);
    arrow.setIgnoreGravity(true);
    arrow.setFixedRotation();
    arrow.setFrictionAir(0);
    arrow.setBounce(0);
    scene.matter.setVelocity(arrow, factor * scene.arrowSpeed, 0);
}

export default Audio;
