import Phaser from 'phaser';
import MountainScene from './MountainScene';
import MatchFindingScene from './MatchFindingScene';

const config = {
	type: Phaser.AUTO,

	height: 480,
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		//autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [MatchFindingScene, MountainScene],
    physics: {
        default: 'matter',
        matter: {
			gravity: {y: 1.5},
			// debug: {
			// 	showBody: true,
			// 	showVelocity: true,
			// 	//renderFill: 0x106909
			// },
			setBounds: {
				left: true,
				right: false,
				top: false,
				bottom: true
			}
		}
	},
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
}

export default new Phaser.Game(config);
