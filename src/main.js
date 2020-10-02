import Phaser from 'phaser';
import MountainScene from './scenes/MountainScene';

const config = {
	type: Phaser.AUTO,
	width: 900,
	height: 700,
	physics: {
		default: 'arcade',
		debug: true,
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [MountainScene]
}

export default new Phaser.Game(config)
