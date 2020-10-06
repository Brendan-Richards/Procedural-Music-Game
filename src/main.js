import Phaser from 'phaser';
import MountainScene from './scenes/MountainScene';
import Preloader from './scenes/Preloader';

const config = {
	type: Phaser.AUTO,

	height: 480,
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		//autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [Preloader, MountainScene],
    physics: {
        default: 'matter',
        matter: {
			gravity: {y: 2},
			debug: false,
			setBounds: {
				left: true,
				right: false,
				top: false,
				bottom: true
			}
        }
	}
}

export default new Phaser.Game(config)
