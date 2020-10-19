import Phaser, { Scene } from 'phaser';
import MountainScene from './MountainScene';

class Audio {

    runSound: Phaser.Sound.BaseSound;
    jumpSound: Phaser.Sound.BaseSound;
    wallSlideSound: Phaser.Sound.BaseSound;
    windSound: Phaser.Sound.BaseSound;
    floorAmbience: Phaser.Sound.BaseSound;
    softLanding: Phaser.Sound.BaseSound;
    hardLanding: Phaser.Sound.BaseSound;
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
        this.softLandingConfig = {
            loop: false,
            volume: 0.1
        }
        this.hardLandingConfig = {
            loop: false,
            volume: 0.3
        }
        this.runConfig = {
            loop: true,
            volume: 0.1
        }
        this.jumpConfig = {
            loop: false,
            volume: 0.1
        }
        this.floorAmbienceConfig = {
            loop: true,
            volume: 1
        }
        this.wallSlideConfig = {
            loop:true,
            volume: 0.2
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
                break;
            }
            case 'jump': { 
                this.runSound.stop();
                this.wallSlideSound.stop();
                this.jumpSound.play(this.jumpConfig);
                break;
            }
            case 'fall': { 
                this.runSound.stop();
                this.wallSlideSound.stop();
                //this.jumpSound.play(this.jumpConfig);
                break;
            }
            // case 'wallSlide': { 
            //     this.runSound.stop();
            //     this.wallSlideSound.play(this.wallSlideConfig);
            //     break;
            // }
            case 'idle1': {
                 //if(this.runSound.isPlaying){
                //     this.runSound.on('looped', () => {
                         this.runSound.stop(); 
                         this.wallSlideSound.stop();
                //     })
                    
                 //}     
            }
        }
    }
}

export default Audio;
