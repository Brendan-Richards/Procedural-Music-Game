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
    attackSound: Phaser.Sound.BaseSound;
    swordRockImpact: Phaser.Sound.BaseSound;;
    drawSound: Phaser.Sound.BaseSound;
    sheathSound: Phaser.Sound.BaseSound;
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
        this.attackSound = scene.sound.add('attack');
        this.drawSound = scene.sound.add('draw');
        this.sheathSound = scene.sound.add('sheath');
        this.swordRockImpact = scene.sound.add('swordRockImpact');

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
            if(animation.key==='attack1' || animation.key==='attack2' || animation.key==='attack3'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();
                this.attackSound.play(this.attackSoundConfig);
                const nudge = scene.currentPlayerDirection==='left' ? -1 : 1;
                scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y);
                scene.swordCollided = false;
            } 
            else if(animation.key==='wallAttack'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.attackSound.play(this.attackSoundConfig);
                const nudge = scene.currentPlayerDirection==='left' ? 1 : -1;
                console.log('setting stop wall slide position');
                scene.swordCollided = false;
                //scene.player.setPosition(scene.player.x + (nudge *10), scene.player.y); 
                 
            }
            else if(animation.key==='airAttack1' || animation.key==='airAttack2'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();
                this.attackSound.play(this.attackSoundConfig);
                scene.swordCollided = false;
            }  
            else if(animation.key==='airAttack3Loop'){
                this.windFlap.play(this.windFlapConfig);
            }
            else if(animation.key==='airAttack3End'){
                this.windFlap.stop();
                this.swordRockImpact.play(this.swordRockImpactConfig);
            }
            else if(animation.key==='run' || animation.key==='runSword'){
                if(!this.runSound.isPlaying){
                    this.runSound.play(this.runConfig); 
                }               
                this.wallSlideSound.stop();
                this.windFlap.stop();
            } 
            else if(animation.key==='jump' || animation.key==='jumpSword'){
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
            else if(animation.key==='fall' || animation.key==='fallSword'){
                this.runSound.stop();
                this.wallSlideSound.stop();               
            }   
            else if(animation.key==='ledgeGrab' || animation.key==='ledgeGrabSword'){
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.windFlap.stop();
                this.wallSmackSound.play(this.wallSmackConfig);               
            }    
            else if(animation.key==='ledgeClimb'){
                this.runSound.stop();
                this.windFlap.stop();
                this.wallSlideSound.stop();
                this.jumpSound.play(this.jumpConfig);               
            } 
            else if(animation.key==='wallSlide' || animation.key==='wallSlideSword'){
                this.runSound.stop();
                this.windFlap.stop();
                if(!this.wallSmackSound.isPlaying && scene.currentPlayerAnimation!=='wallAttack'){
                    this.wallSmackSound.play(this.wallSmackConfig);
                }
                this.wallSlideSound.play(this.wallSlideConfig);  
                //console.log('in hook for wall slide anim start')
                if(scene.currentPlayerAnimation==='wallAttack'){
                    //console.log('previous anim was wall attack')
                    scene.player.setPosition(scene.stopWallSlidingPosition.x, scene.player.y);
                }             
            }
            else if(animation.key==='idle1' || animation.key==='idleSword'){
                this.runSound.stop(); 
                this.windFlap.stop();
                this.wallSlideSound.stop();              
            }  
            else if(animation.key==='draw' || animation.key==='drawAir' ){
                this.drawSound.play(this.drawSoundConfig);
            }    
            else if(animation.key==='sheath' || animation.key==='sheathAir'){
                this.sheathSound.play(this.sheathSoundConfig);
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

export default Audio;
