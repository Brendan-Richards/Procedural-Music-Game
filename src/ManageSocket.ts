import MountainScene from './MountainScene';
import {makeExplosion, setCollisionMask} from './Collisions';
import { displayEndScreen } from './EndMatch';

const manageSocket = (scene: MountainScene) => {

    scene.socket.on('opponentMovementUpdate', (opponentData) => {
        //console.log('client recieved opponentMovement Update');
        scene.opponent.setPosition(opponentData.x, opponentData.y);
        scene.opponent.setVelocity(opponentData.vx, opponentData.vy);
    });

    scene.socket.on('createArrow', (arrowData) => {
        //console.log('client recieved createArrow event');
       
        const arrow = scene.matter.add.sprite(arrowData.x, arrowData.y, 'arrow', undefined);
        arrow.setScale(scene.arrowScale);
        //console.log('opponent arrow object right after creation:', arrow); 
   
        arrow.body.label = 'opponentArrow';
        arrow.body.collisionFilter.category = scene.collisionCategories.opponentArrow;
        setCollisionMask(scene, arrow, ['opponent', 'playerArrow', 'opponentArrow', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);    
      
        scene.opponentArrows.push(arrow);

        if(scene.opponentArrows.length > scene.maxArrows){
            const oldest = scene.opponentArrows.shift();
            oldest.destroy();
        }
        
        if(arrowData.flipX){
            arrow.setFlipX(true);
        }

      
       // console.log('opponent arrow object right after setting collision:', arrow); 
        //console.log(scene.opponentArrows);
        // arrow.setCollisionGroup(scene.opponentGroup);
        // arrow.setCollisionCategory(scene.opponentProjectilesCategory);
        // arrow.body.collisionFilter.mask = 0x1000;
        // arrow.setCollisionCategory(scene.opponentMask);
        // arrow.setCollidesWith(scene.playerMask);
        arrow.setIgnoreGravity(true);
        arrow.setFixedRotation();
        arrow.setFrictionAir(0);
        scene.matter.setVelocity(arrow, arrowData.factor * scene.arrowSpeed, 0);            
    });

    scene.socket.on('createMagic', (magicData) => {
        //console.log('client recieved createMagic event');

        //make magic
        const verts = [{x: 50, y: 0}, {x: 70, y: 0}, {x: 70, y: 10}, {x: 50, y: 10}];
        const magic = scene.matter.add.sprite(magicData.x, magicData.y, 'magicAtlas', magicData.frameName, {
            vertices: verts,
            render: {
                sprite: {
                    xOffset: (magicData.flipX ? -1 : 1) * 0.35
                }
            }
        });
        magic.setScale(scene.playerScaleFactor, scene.playerScaleFactor);
        magic.name = 'opponentMagic';

        if(magicData.flipX){
            magic.setFlipX(true); 
        }
        
        magic.play('redMagic', true);
        // if(magicData.magicType==='red'){
            
        // }
        // else{
        //     magic.play('blueMagic', true);
        // }

        magic.body.label = 'opponentMagic';
        magic.body.collisionFilter.category = scene.collisionCategories.opponentMagic;
        setCollisionMask(scene, magic, ['opponent', 'playerBox', 'playerArrow', 'opponentArrow', 'opponentBox', 'playerMagic', 'playerExplosion', 'opponentMagic', 'opponentExplosion']);    
    
        // magic.setCollisionGroup(scene.opponentGroup);
        // magic.setCollisionCategory(scene.opponentMask);
        // magic.setCollidesWith(scene.playerMask);
        magic.setIgnoreGravity(true);
        magic.setFixedRotation();
        magic.setFrictionAir(0);
        scene.matter.setVelocity(magic, magicData.factor * scene.magicSpeed, 0);
    
    });

    scene.socket.on('opponentDamaged', data => {

        let suffix = '';

        switch(scene.opponentHealth){
            case 100: {suffix = '100'; break;}
            case 75: {suffix = '075'; break;}
            case 50: {suffix = '050'; break;}
            case 25: {suffix = '025'; break;}
            case 0: {suffix = '000'; break;}
        }

        console.log('playing opponent blood animation:', data.name + suffix);
        const blood = scene.add.sprite(data.x, data.y, data.name + suffix);
        blood.play( data.name + suffix);
        blood.once('animationcomplete', animation => {
            console.log('finished blood animation');
            blood.destroy();
        });

        scene.opponentHealth -= data.damageAmount;
        //scene.opponentHealthBar.decrease(data.damageAmount);

        const currentFrameIndex = scene.opponent.anims.currentFrame.index - 1;

        let num = scene.opponentHealth.toString();
        while(num.length < 3){
            num = '0' + num;
        }
    
        scene.opponent.play(scene.currentOpponentAnimation + num, true, currentFrameIndex);
    });

    scene.socket.on('opponentSound', soundData => {
        if(scene.allowSound){
            //console.log('recieved sound start event');
            //console.log(soundData);
            const distance = {x: Math.abs(scene.player.x - soundData.x), y: Math.abs(scene.player.y - soundData.y)};
            //console.log('distance of sound to player:', distance);
            scene.opponentAudio[soundData.name].sound.play(scene.opponentAudio[soundData.name].config);
            //console.log('sound object is:', scene.opponentAudio[soundData.name]);
            const newVolume = soundAttenuation(scene, scene.opponentAudio[soundData.name].config.volume, distance);
            //console.log('new volume:', newVolume);
            scene.opponentAudio[soundData.name].sound.volume = newVolume;
        }
    });

    scene.socket.on('opponentSoundStop', soundData => {
        //console.log('recieved sound stop event');
        soundData.forEach(element => {
            if(scene.opponentAudio[element].sound.isPlaying){
                scene.opponentAudio[element].sound.stop();
            }
        });
    });

    scene.socket.on('opponentRecoil', () => {
        const oFactor = scene.currentOpponentDirection==='left' ? 1 : -1;
        scene.tweens.add({
            targets: scene.opponent,
            duration: scene.recoilDuration,
            x: scene.opponent.body.position.x+(oFactor * scene.swordRecoil)
        });
    });

    scene.socket.on('bloodAnimation', data => {

        // let suffix = '';

        // switch(data.name==='blood' ? scene.playerHealth : scene.opponentHealth){
        //     case 100: {suffix = '100'; break;}
        //     case 75: {suffix = '075'; break;}
        //     case 50: {suffix = '050'; break;}
        //     case 25: {suffix = '025'; break;}
        //     case 0: {suffix = '000'; break;}
        // }

        // console.log('playing blood animation:', data.name + suffix);
        // const blood = scene.add.sprite(data.x, data.y, data.name + suffix);
        // blood.play( data.name + suffix);
        // blood.once('animationcomplete', animation => {
        //     console.log('finished blood animation');
        //     blood.destroy();
        // });
    });

    scene.socket.on('explosion', data => {
        makeExplosion(scene, data.x, data.y, data.opponent);
    });

    scene.socket.on('removeAttackBoxes', () => {
        console.log('removing attack boxes');
        scene.bothAttacking = false;
        if(scene.playerAttackBox){
            scene.matter.world.remove(scene.playerAttackBox);
            scene.playerAttackBox = null;
        }
        if(scene.opponentAttackBox){
            scene.matter.world.remove(scene.opponentAttackBox);
            scene.opponentAttackBox = null;
        }
        
        
    });

    scene.socket.on('opponentLost', data => {
        console.log('data recieved from opponentLost event:', data);

        scene.matchEnded = true;

        scene.opponent.play(data.deathAnimation + 'Opponent000', true);
        scene.opponent.once('animationcomplete', () => {
            displayEndScreen(scene, true);
        });
    });

    scene.socket.on('opponentDisconnect', () => {
        console.log('opponent disconnected');
        displayEndScreen(scene, false, true);
    });

    scene.socket.on('opponentAnimationUpdate', (opponentData) => {
        if(scene.opponent){
            
            scene.opponent.setScale(1);
        
            scene.opponent.setScale((opponentData.flipX ? -1 : 1)*scene.playerScaleFactor, scene.playerScaleFactor);
        
            let suffix = '';

            switch(scene.opponentHealth){
                case 100: {suffix = '100'; break;}
                case 75: {suffix = '075'; break;}
                case 50: {suffix = '050'; break;}
                case 25: {suffix = '025'; break;}
                case 0: {suffix = '000'; break;}
            }

            console.log('setting opponent animation to:', opponentData.currentAnimation + 'Opponent' + suffix);

            scene.opponent.play(opponentData.currentAnimation + 'Opponent' + suffix, false, 0);  

            scene.opponent.setBounce(0);
            scene.opponent.setFixedRotation(); 

            scene.currentOpponentDirection = opponentData.flipX ? 'left' : 'right';
            scene.currentOpponentAnimation = opponentData.currentAnimation + 'Opponent';

            if(scene.opponentAttackBox){
                scene.matter.world.remove(scene.opponentAttackBox);
                scene.opponentAttackBox = null;
            }
            if(scene.swordAttacks.includes(opponentData.currentAnimation) || ['bowKick', 'airSwing3Loop'].includes(opponentData.currentAnimation)){
                console.log('entered if statement to create new opponent box');
                
                let xOffset = 0;
                let yOffset = 0;
                let radius = 10
                const factor = opponentData.flipX ? -1 : 1;
                switch(opponentData.currentAnimation){
                    case 'airSwing3Loop': {xOffset = 0; yOffset = 0; radius = 14; break;}
                    case 'wallSwing': {xOffset = -10; yOffset = 0; radius = 13; break;}
                    case 'bowKick': {xOffset = 8; yOffset = 1; radius = 9; break;}
                    case 'airSwing1': {xOffset = 4; yOffset = -5; radius = 15; break;}
                    case 'airSwing2': {xOffset = 7; yOffset = -3; radius = 15; break;}
                    case 'runSwing': {xOffset = 6; yOffset = 0; radius = 14; break;}
                    case 'idleSwing1': {xOffset = 6; yOffset = -1; radius = 13; break;}
                    case 'idleSwing2': {xOffset = 7; yOffset = -6; radius = 14; break;}
                    // case 'airSwing3Loop': {xOffset = 0; yOffset = 16; radius = 9; break;}
                    // case 'wallSwing': {xOffset = -10; yOffset = 0; radius = 13; break;}
                    // case 'bowKick': {xOffset = 8; yOffset = 1; radius = 9; break;}
                    // case 'airSwing1': {xOffset = 12; yOffset = -6; radius = 9; break;}
                    // case 'airSwing2': {xOffset = 12; yOffset = -7; radius = 12; break;}
                    // case 'runSwing': {xOffset = 14; yOffset = 0; radius = 9; break;}
                    // case 'idleSwing1': {xOffset = 10; yOffset = -2; break;}
                    // case 'idleSwing2': {xOffset = 12; yOffset = -7; break;}
                }

                scene.opponentAttackBox = scene.matter.add.circle(scene.opponent.x + (factor * xOffset), scene.opponent.y + yOffset, radius, {
                    label: 'opponentBox',
                    ignoreGravity: true,
                    frictionAir: 0,
                    friction: 0,
                    collisionFilter: {
                        group: scene.opponentGroup
                    }
                });

                const gameObj = scene.add.circle(scene.opponent.x + (factor * xOffset), scene.opponent.y + yOffset, radius, undefined, 0);
                gameObj.body = scene.opponentAttackBox;
                scene.opponentAttackBox.collisionFilter.category = scene.collisionCategories.opponentBox;
                //console.log('dummy opponent game obj:', gameObj);
                setCollisionMask(scene, gameObj, ['terrain', 'opponent', 'opponentBox', 'opponentArrow', 'playerMagic', 'opponentMagic', 'playerExplosion', 'opponentExplosion']);
                //console.log('dummy game obj after setting collision:', gameObj);

                if(opponentData.currentAnimation==='airSwing3Loop'){
                    console.log('entered if statement to set opponent box velocity');
                    scene.matter.setVelocity(scene.opponentAttackBox as Phaser.Types.Physics.Matter.MatterBody, 0, scene.playerMaxSpeed + 0.3);
                }
            }


        }
    });

    console.log('setting ping..');
    scene.socket.on('ping', () => {
        scene.latency = scene.time.now - scene.pingSendTime;
        console.log('latency is:', scene.latency, 'ms'); 
    });
    
}

const soundAttenuation = (scene: MountainScene, v0: number, distance: {x: number, y: number}): number => {
    const norm = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
    return v0 * Math.exp(-1 * 2.5 * norm/scene.maxGameWidth);
}

export {manageSocket};