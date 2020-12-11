import MountainScene from './MountainScene';

const managePlayerInput = (scene: MountainScene) => {
    //input setup
    /////////////////////////////////////////////////////////////////////////////////
    // scene.input.on('gameout', () => {
    //     console.log('game out event')
    //     scene.pointerOnCanvas = false;
    // }, scene);
    // scene.input.on('gameover', () => {
    //     console.log('game over event')
    //     scene.pointerOnCanvas = true;
    // }, scene);

    window.onfocus = () => { 
        //console.log('allow sound true');
        scene.audio.floorAmbience.sound.play(scene.audio.floorAmbience.config);
        scene.audio.windSound.sound.play(scene.audio.windSound.config);
        scene.allowSound = true; 
    }; 
      
      window.onblur = () => { 
        //console.log('allow sound false');
        scene.audio.floorAmbience.sound.stop();
        scene.audio.windSound.sound.stop();
        scene.allowSound = false; 
    }; 
    
    scene.cursors = scene.input.keyboard.createCursorKeys();

    scene.controlConfig = {
        leftControl: {
            isDown: false,
            isUp: true
        },
        rightControl: {
            isDown: false,
            isUp: true
        },
        downControl: {
            isDown: false,
            isUp: true
        },
        jumpControl: scene.cursors.space as Phaser.Input.Keyboard.Key,
        groundSlide: {
            isDown: scene.CTRLDown,
            isUp: !scene.CTRLDown
        },
        attack: {
            isDown: scene.attackDown,
            isUp: !scene.attackDown
        }
    }

    scene.input.mouse.disableContextMenu();
    //scene.input.setDefaultCursor('none');

    scene.input.on('pointerdown', (pointer) => {
        const canAttack = !scene.swordAttacks.includes(scene.currentPlayerAnimation) && !scene.bowAttacks.includes(scene.currentPlayerAnimation) && !scene.playerAttacking && !scene.meeleeAttacks.includes(scene.currentPlayerAnimation) && !scene.playerLedgeGrab; //&& !scene.swordDraws.includes(scene.currentPlayerAnimation) && !scene.swordSheaths.includes(scene.currentPlayerAnimation)
       
        if(scene.equippedWeapon==='sword' && canAttack){
            if(pointer.leftButtonDown()){
                scene.playerAttacking = true;

                if(!scene.playerCanJump && scene.controlConfig.downControl.isDown){
                    scene.downAttack = true;
                }
                else{
                    scene.downAttack = false;
                }
            }
            else if(pointer.rightButtonDown()){
                scene.playerAttacking = true;
                scene.heavyAttack = true;
            }
        }
        else if(scene.equippedWeapon==='bow' && canAttack && !scene.playerWallSliding){
            if(pointer.leftButtonDown()){ 
                scene.playerAttacking = true; 
                scene.bowRelease = false;
            }
            else if(pointer.rightButtonDown() && scene.playerCanJump){
                scene.playerAttacking = true;
                scene.bowKick = true;
            }                
        }
        if(scene.equippedWeapon==='glove' && !scene.playerAttacking && !scene.audio.castSound.sound.isPlaying){
            const leftButton = 0;
            const rightButton = 2;
            //console.log(pointer)
            if(pointer.button===leftButton){                   
                scene.magicType = 'blue';
                scene.playerAttacking = true;
            }
            // else if(pointer.button===rightButton){ 
            //     scene.magicType = 'blue';
            //     scene.playerAttacking = true;
            // }  
            //console.log('current magic type:', scene.magicType);                      
        }
    }, scene);

    scene.input.on('pointerup', (pointer) => {
        const leftButton = 0;
        const rightButton = 2;
        if(scene.equippedWeapon==='bow' && pointer.button===leftButton){
            scene.bowRelease = true;               
        }
    }, scene);

    scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        //console.log(pointer);
        if(scene.time.now - scene.lastWeaponChangeTime > scene.minTimeBetweenWeaponChanges &&
                !scene.swordAttacks.includes(scene.currentPlayerAnimation) &&
                !scene.bowAttacks.includes(scene.currentPlayerAnimation) &&
                !scene.meeleeAttacks.includes(scene.currentPlayerAnimation) &&
                !scene.magicAttacks.includes(scene.currentPlayerAnimation) &&
                scene.currentPlayerAnimation!=='airSwing3Start' &&
                scene.currentPlayerAnimation!=='airSwing3Loop' &&
                scene.currentPlayerAnimation!=='airSwing3End'){
            scene.prevEquippedWeapon = scene.equippedWeapon;
            const currWeaponIdx = scene.weaponsFound.findIndex((element) => {
                return element===scene.equippedWeapon;
            });
            if(pointer.deltaY > 0){
                //console.log('scrolled mouse wheel down');
                scene.equippedWeapon = scene.weaponsFound[(currWeaponIdx + 1) % scene.weaponsFound.length];
            }
            else{
                //console.log('scrolled mouse wheel up');
                scene.equippedWeapon = scene.weaponsFound[(currWeaponIdx - 1) + (currWeaponIdx===0 ? scene.weaponsFound.length : 0)];
            }
            //console.log('previous weapon:', scene.prevEquippedWeapon);
            //console.log('current Weapon:', scene.equippedWeapon);
            //console.log('current player animation:', scene.currentPlayerAnimation);
            scene.changedWeapon = true;

            scene.lastWeaponChangeTime = scene.time.now;
        }
    }, scene);

    scene.input.keyboard.on('keyup-' + 'A', (event) => {
        scene.controlConfig.leftControl.isDown = false;
        scene.controlConfig.leftControl.isUp = true;
    });
    scene.input.keyboard.on('keydown-' + 'A', (event) => {
        scene.controlConfig.leftControl.isDown = true;
        scene.controlConfig.leftControl.isUp = false;
    });
    scene.input.keyboard.on('keyup-' + 'D', (event) => {
        scene.controlConfig.rightControl.isDown = false;
        scene.controlConfig.rightControl.isUp = true;
    });
    scene.input.keyboard.on('keydown-' + 'D', (event) => {
        scene.controlConfig.rightControl.isDown = true;
        scene.controlConfig.rightControl.isUp = false;
    });
    scene.input.keyboard.on('keyup-' + 'S', (event) => {
        scene.controlConfig.downControl.isDown = false;
        scene.controlConfig.downControl.isUp = true;
    });
    scene.input.keyboard.on('keydown-' + 'S', (event) => {
        scene.controlConfig.downControl.isDown = true;
        scene.controlConfig.downControl.isUp = false;
    });
}

export {managePlayerInput};