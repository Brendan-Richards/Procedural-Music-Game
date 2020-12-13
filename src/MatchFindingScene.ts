// import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class MatchFindingScene extends Phaser.Scene{

    loadText: Phaser.GameObjects.Text;
    titleText: Phaser.GameObjects.Text;
    findMatchText: Phaser.GameObjects.Text;
    findMatchButton: Phaser.GameObjects.Rectangle;
    socket: io.Socket;
    foundMatch: boolean;
    lastTextUpdateTime: number;

	constructor(){
        super('MatchFindingScene');    
    }
    
    preload(){

    }

    create(){
        //console.log('in create function of match finding scene');

        this.input.mouse.disableContextMenu();

        this.foundMatch = false;

        this.socket = io();
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');

        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        this.findMatchButton = this.add.rectangle(width/2, height - 33, 200, 50, 0xcccccc);
        this.findMatchButton.setStrokeStyle(2, 0x000000);
        this.findMatchButton.setInteractive();
        this.findMatchButton.on('pointerover', () => {
            this.findMatchButton.setFillStyle(0x999999);   
        });
        this.findMatchButton.on('pointerout', () => {
           this.findMatchButton.setFillStyle(0xcccccc);    
       });
       this.findMatchButton.on('pointerdown', () => { 
            this.findMatchButton.destroy(); 
            this.findMatchText.destroy(); 
            this.loadText = this.add.text(width/2 - 100, height-10, 'Finding Match...', { 
                fontFamily: 'Arial',
                fontSize: '30px',
                padding: {
                    left: 5,
                    right: 5,
                    top: 0,
                    bottom: 5,
                },
                color: '#000',
            }).setOrigin(0, 1);  

            this.socket.emit('findMatch');
        }, this);

        this.findMatchText = this.add.text(width/2, height-30, 'Find Match', { 
            fontFamily: 'Arial',
            fontSize: '30px',
            padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 5,
            },
            color: '#000',
        }).setOrigin(0.5, 0.5); 

        this.lastTextUpdateTime = this.time.now;
        
        this.titleText = this.add.text(width/2, height/2, 'Shade', { 
            fontFamily: 'Arial',
            fontSize: '50px',
            padding: {
                left: 8,
                right: 8,
                top: 0,
                bottom: 0,
            },
            shadow: {
                offsetX: 6,
                offsetY: 6,
                color: '#333',
                blur: 6,
                stroke: true,
                fill: true
            },
            color: '#000',
        }).setOrigin(0.5, 0.5);

        this.socket.on('matchFound', (data) => {
            data.socket = this.socket;
            this.cameras.resetAll();
            this.events.destroy();
            // this.scene.remove('MatchFindingScene');
            // this.scene.add('MatchFindingScene', MatchFindingScene, false);
            this.scene.start('MountainScene', data);
        })

    }


    update(){
        if(this.loadText && this.time.now  - this.lastTextUpdateTime > 400){
            //console.log('setting the dots');
            let dots = '';
            switch(this.loadText.text.length){
                case 15: {dots = '...'; break;}
                case 14: {dots = '..'; break;}
                case 13: {dots = '.'; break;}
            }
            this.loadText.setText('Finding Match' + dots);
            this.lastTextUpdateTime = this.time.now;
        }
    }

}

