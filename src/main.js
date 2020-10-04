import Phaser from 'phaser';
import MountainScene from './scenes/MountainScene';
import Preloader from './scenes/Preloader';

const config = {
	type: Phaser.AUTO,
	// width: 1080,
	// height: 800,
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT
	},
    physics: {
        default: 'matter',
        matter: {
			debug: true,
			setBounds: {
				left: true,
				right: false,
				top: false,
				bottom: true
			}
        }
	},
	scene: [Preloader, MountainScene]
}

export default new Phaser.Game(config)
