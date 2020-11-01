import Phaser, { Scene } from 'phaser';
import MountainScene from './MountainScene';

class Audio {

    runSound: Phaser.Sound.BaseSound;
    jumpSound: Phaser.Sound.BaseSound;
    wallJumpSound: Phaser.Sound.BaseSound;
    wallSlideSound: Phaser.Sound.BaseSound;
    windSound: Phaser.Sound.BaseSound;
    floorAmbience: Phaser.Sound.BaseSound;
    softLanding: Phaser.Sound.BaseSound;
    hardLanding: Phaser.Sound.BaseSound;
    wallSmackSound: Phaser.Sound.BaseSound;
    wallSmackConfig: object;
    softLandingConfig: object;
    hardLandingConfig: object;
    windConfig: object;
    runConfig: object;
    floorAmbienceConfig: object;
    jumpConfig: object;
    wallSlideConfig: object;

    constructor(scene: MountainScene){
        this.runSound = scene.sound.add('steps');
        this.jumpSound = scene.sound.add('jump');
        this.wallSlideSound = scene.sound.add('wallSlide');
        this.floorAmbience = scene.sound.add('floorAmbience');
        this.windSound = scene.sound.add('wind');
        this.softLanding = scene.sound.add('jump');
        this.hardLanding = scene.sound.add('hardLanding');
        this.wallSmackSound = scene.sound.add('wallSmack');
        this.wallJumpSound = scene.sound.add('jump');

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
            volume: 0.2
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
    }

    ambience = () => {
        this.floorAmbience.play(this.floorAmbienceConfig);
        this.windSound.play(this.windConfig);
    }

    playAnimationSound = (animation: string): void => {
        //console.log('in play animation sound');
        //console.log('    ', animation);
        switch(animation){
            case 'run': { 
                if(!this.runSound.isPlaying){
                    this.runSound.play(this.runConfig); 
                }               
                this.wallSlideSound.stop();
                break;
            }
            case 'jump': { 
                this.runSound.stop();
                this.wallSlideSound.stop();
                if(!this.jumpSound.isPlaying){
                    this.jumpSound.play(this.jumpConfig);
                }
                break;
            }
            case 'wallJump': { 
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.wallJumpSound.play(this.jumpConfig);
                break;
            }
            case 'fall': {  
                this.runSound.stop();
                this.wallSlideSound.stop();
                break;
            }
            case 'ledgeGrab': { 
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.wallSmackSound.play(this.wallSmackConfig);
                break;
            }
            case 'ledgeClimb': { 
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.jumpSound.play(this.jumpConfig);
                break;
            }
            case 'wallSlide': { 
                this.runSound.stop();
                //if(!this.wallSmackSound.isPlaying){
                    this.wallSmackSound.play(this.wallSmackConfig);
               // }
                this.wallSlideSound.play(this.wallSlideConfig);
                break;
            }
            case 'idle1': {
                this.runSound.stop(); 
                this.wallSlideSound.stop();
    
            }
        }
    }
}

export default Audio;
