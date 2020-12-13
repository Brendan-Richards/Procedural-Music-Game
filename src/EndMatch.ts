import MountainScene from './MountainScene';
import {setCollisionMask} from './Collisions';
import MatchFindingScene from './MatchFindingScene';

const endMatch = (scene: MountainScene) => {
    //scene.scene.start('matchFindingScene');

    setCollisionMask(scene, scene.player, ['player','opponent', 'playerBox', 'opponentBox', 'playerArrow', 'opponentArrow', 'playerMagic', 'opponentMagic', 'playerExplosion', 'opponentExplosion']);
    let animation = 'dieSword';
    switch(scene.equippedWeapon){
        case 'sword': {break;}
        case 'bow': {animation = 'dieBow'; break;}
        case 'glove': {animation = 'dieGlove'; break;}
    }
    scene.player.play(animation + '000', true);
    scene.player.once('animationcomplete', () => {
        displayEndScreen(scene, false);
    });

    scene.socket.emit('playerLost', {deathAnimation: animation});
    scene.socket.close();
    
    scene.matchEnded = true;
}

const displayEndScreen = (scene: MountainScene, won: boolean, draw = false) => {
    //console.log('setting screen tint');
    let text;
    let rect;

    scene.matter.setVelocity(scene.player.body as Phaser.Types.Physics.Matter.MatterBody, 0, scene.player.body.velocity.y);
    scene.matter.setVelocity(scene.opponent.body as Phaser.Types.Physics.Matter.MatterBody, 0, scene.opponent.body.velocity.y);

    if(draw){
        // scene.socket.close();
        scene.matchEnded = true; 

        rect = scene.add.rectangle(0, 0, scene.maxGameWidth, scene.maxGameHeight, 0xaaaaaa, 0.9).setOrigin(0,0).setDepth(99);
        text = scene.add.text(scene.cameras.main.worldView.centerX, scene.cameras.main.worldView.centerY, 'Opponent Disconnected\n          Match Draw', { 
            fontFamily: 'Arial',
            fontSize: '30px',
            padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 5,
            },
            // color: 'rgb(255, 0, 0)'
            color: 'rgb(255, 255, 255)'
        }); 
        text.setDepth(100).setOrigin(0.5, 0.5);  

    }
    else if(won){
        rect = scene.add.rectangle(0, 0, scene.maxGameWidth, scene.maxGameHeight, 0xffffff, 0.7).setOrigin(0,0).setDepth(99);
        text = scene.add.text(scene.cameras.main.worldView.centerX, scene.cameras.main.worldView.centerY, 'You Won!', { 
            fontFamily: 'Arial',
            fontSize: '30px',
            padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 5,
            },
            // color: 'rgb(255, 0, 0)'
            color: 'rgb(38, 53, 190)'
        }); 
        text.setDepth(100).setOrigin(0.5, 0.5);  
    }
    else{
        rect = scene.add.rectangle(0, 0, scene.maxGameWidth, scene.maxGameHeight, 0x000000, 0.7).setOrigin(0,0).setDepth(99);
        text = scene.add.text(scene.cameras.main.worldView.centerX, scene.cameras.main.worldView.centerY, 'You Lost', { 
            fontFamily: 'Arial',
            fontSize: '30px',
            padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 5,
            },
            // color: 'rgb(255, 0, 0)'
            color: 'rgb(162, 71, 0)'
        }); 
        text.setDepth(100).setOrigin(0.5, 0.5);        
    }
    //console.log(text);
    //console.log('rect:', rect);

    scene.time.addEvent({
        delay: 2000,
        callback: () => {
            rect.setInteractive();
            rect.on('pointerdown', () => { 
                //scene.scene.remove('MountainScene');
                scene.cameras.resetAll();
                scene.events.destroy();
                //scene.cache.destroy();
                scene.socket.close();
                //scene.events.removeAllListeners();
                //scene.events.shutdown();
                //scene.cameras.main.stopFollow();
                //scene.scene.stop('MountainScene');
                //scene.scene.remove('MountainScene');
                scene.scene.remove('MatchFindingScene');
                scene.scene.remove('MountainScene');
                scene.scene.add('MatchFindingScene', MatchFindingScene, false);
                scene.scene.add('MountainScene', MountainScene, false);
                scene.scene.start('MatchFindingScene');
                
 
            });

            const findMatchText = scene.add.text(text.x, text.y + text.height + 11, 'Click Anywhere', { 
                fontFamily: 'Arial',
                fontSize: '30px',
                padding: {
                    left: 5,
                    right: 5,
                    top: 0,
                    bottom: 5,
                },
                color: text.style.color,
            }).setOrigin(0.5, 0.5).setDepth(101).setScale(0.5); 
        },
        callbackScope: scene
    });


    const keys = Object.keys(scene.audio);
    //console.log('audio keys:', keys);
    keys.forEach(key => {
        if(!['scene', 'ambience', 'randomChoice', 'startAnimationAudio', 'musicReady', 'musicRNN', 'player', 'possibleNotes'].includes(key)){
            //console.log(key);
            scene.audio[key].sound.stop();
            scene.opponentAudio[key].sound.stop();
        }
    });

}

export { endMatch, displayEndScreen };