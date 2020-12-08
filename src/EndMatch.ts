import MountainScene from './MountainScene';
import {setCollisionMask} from './Collisions';

const endMatch = (scene: MountainScene) => {
    setCollisionMask(scene, scene.player, ['player','opponent', 'playerBox', 'opponentBox', 'playerArrow', 'opponentArrow', 'playerMagic', 'opponentMagic', 'playerExplosion', 'opponentExplosion']);
    let animation = 'dieSword';
    switch(scene.equippedWeapon){
        case 'sword': {break;}
        case 'bow': {animation = 'dieBow'; break;}
        case 'glove': {animation = 'dieGlove'; break;}
    }
    scene.player.play(animation, true);
    scene.socket.emit('playerLost');

    scene.matchEnded = true;
}

export { endMatch };