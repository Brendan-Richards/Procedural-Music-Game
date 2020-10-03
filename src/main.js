import Phaser from 'phaser';
import MountainScene from './scenes/MountainScene';
import Preloader from './scenes/Preloader';

const config = {
	type: Phaser.AUTO,
	// width: 800,
	// height: 600,
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT
	},
    physics: {
        default: 'matter',
        matter: {
			debug: false,
			setBounds: {
				left: true,
				right: true,
				top: true,
				bottom: true
			}
        }
	},
	scene: [Preloader, MountainScene]
}

export default new Phaser.Game(config)
