// import Phaser from 'phaser';
import { io } from 'socket.io-client';
//import noScroll from './NoScroll.js';
import placeInformation from './GameInfo.js';

export default class MatchFindingScene extends Phaser.Scene{

    loadText: Phaser.GameObjects.Text;
    titleText: Phaser.GameObjects.Text;
    findMatchText: Phaser.GameObjects.Text;
    playWithBotText: Phaser.GameObjects.Text;
    playWithBotButton: Phaser.GameObjects.Rectangle;
    findMatchButton: Phaser.GameObjects.Rectangle;
    backRect: Phaser.GameObjects.Rectangle;
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

        treeLayer(this);

        //if the game canvas doesn't have a wrapping div, then we must need to build the info sections
        if(false && this.game.canvas.parentNode.isSameNode(document.body)){
            placeInformation(this);
        }

        //document.body.removeEventListener('scroll', noScroll);

        this.input.mouse.disableContextMenu();

        this.foundMatch = false;

        this.socket = io();
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');

        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        // this.backRect = this.add.rectangle(width/2, height/2, 200, 200, 0xcccccc).setDepth(100);

        this.findMatchButton = this.add.rectangle(width/2, height - 113, 200, 50, 0xcccccc).setDepth(100);
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
            this.loadText = this.add.text(width/2 - 90, height-90, 'Finding Match...', { 
                fontFamily: 'Arial',
                fontSize: '26px',
                padding: {
                    left: 5,
                    right: 5,
                    top: 0,
                    bottom: 5,
                },
                color: '#000',
            }).setOrigin(0, 1).setDepth(100); 
            
            makePlayWithBotButton(this, width, height);

            this.socket.emit('findMatch');
        }, this);

        this.findMatchText = this.add.text(width/2, height-110, 'Find Match', { 
            fontFamily: 'Arial',
            fontSize: '26px',
            padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 5,
            },
            color: '#000',
        }).setOrigin(0.5, 0.5).setDepth(100); 

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
                color: '#555',
                blur: 6,
                stroke: true,
                fill: true
            },
            color: '#000',
        }).setOrigin(0.5, 0.5).setDepth(100);

        this.socket.on('matchFound', (data) => {
            data.socket = this.socket;
            this.cameras.resetAll();
            this.events.destroy();
            // this.scene.remove('MatchFindingScene');
            // this.scene.add('MatchFindingScene', MatchFindingScene, false);
            this.scene.start('MountainScene', data);
        });

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

const makePlayWithBotButton = (scene: MatchFindingScene, width: number, height: number) => {
    const buttonHeight = 50;
    const buttonWidth = 200;
    const sideOffset = 25;

    scene.playWithBotButton = scene.add.rectangle(width - buttonWidth/2 - sideOffset, height - buttonHeight/2 - sideOffset, buttonWidth, buttonHeight, 0xcccccc).setDepth(100);
    scene.playWithBotButton.setStrokeStyle(2, 0x000000);
    scene.playWithBotButton.setInteractive();

    scene.playWithBotText = scene.add.text(width - buttonWidth/2 - sideOffset, height - buttonHeight/2 - sideOffset, 'Play With Bot', { 
        fontFamily: 'Arial',
        fontSize: '26px',
        padding: {
            left: 5,
            right: 5,
            top: 0,
            bottom: 5,
        },
        color: '#000',
    }).setOrigin(0.5, 0.5).setDepth(100);    

    scene.playWithBotButton.on('pointerover', () => {
        scene.playWithBotButton.setFillStyle(0x999999);   
    });
    scene.playWithBotButton.on('pointerout', () => {
       scene.playWithBotButton.setFillStyle(0xcccccc);    
   });
   scene.playWithBotButton.on('pointerdown', () => { 
        scene.socket.emit('botMatch');
    }, scene);
};

const treeLayer = (scene: MatchFindingScene) => {

    const graphics = scene.add.graphics({x: 0, y: 0, add: false});
    const x = Math.random() * scene.cameras.main.displayWidth;
    const y = scene.cameras.main.displayHeight;
    const branchColor = Phaser.Display.Color.GetColor(100, 100, 100);
    const leafColor = Phaser.Display.Color.GetColor(190, 190, 190);

    drawTree(graphics, scene.cameras.main.displayWidth * 0, y, 0, 100, 10, branchColor, leafColor, 'right', true);
    drawTree(graphics, scene.cameras.main.displayWidth * 0.25, y, 0, 100, 10, branchColor, leafColor, 'right', true);
    //drawTree(graphics, scene.cameras.main.displayWidth * 0.5, y, 0, 100, 10, branchColor, leafColor, 'right', true);
    drawTree(graphics, scene.cameras.main.displayWidth * 0.75, y, 0, 100, 10, branchColor, leafColor, 'right', true);
    drawTree(graphics, scene.cameras.main.displayWidth, y, 0, 100, 10, branchColor, leafColor, 'right', true);

    graphics.generateTexture('trees', scene.cameras.main.displayWidth, scene.cameras.main.displayHeight);
    graphics.clear();
    scene.add.sprite(0, 0, 'trees').setOrigin(0,0);
}

const drawTree = (graphics: Phaser.GameObjects.Graphics,
    startX, 
    startY, 
    prevAngle, 
    len, 
    branchWidth, 
    color1, 
    color2, 
    direction,
    root = false) => {

    const maxRotation = 40; // angle in degrees
    const minBranchWidth = 5;
    const leafWidth = 8;
    const leafHeight = 12;

    graphics.beginPath();
    graphics.save();
    graphics.lineStyle(branchWidth, color1);
    graphics.fillStyle(color2);

    let rotationAmount = 0; //angle in degrees
    if(!root){
        rotationAmount = Math.random() * maxRotation;
    }

    let angle = (prevAngle + rotationAmount);
    if(direction==='left'){
        angle = (prevAngle - rotationAmount);
    }
    graphics.moveTo(startX, startY);

    const dx = len * Math.sin(angle * Math.PI/180);
    const dy = len * Math.cos(angle * Math.PI/180);

    graphics.lineTo(startX + dx, startY - dy);
    graphics.stroke();

    if (len < minBranchWidth) {
        graphics.beginPath();
        graphics.fillEllipse(startX + dx, startY - dy, leafWidth, leafHeight);
        graphics.restore();
        return;
    }


    const leftLength = (Math.random() * 0.5 + 0.5) * len;
    const leftWidth = (Math.random() * 0.5 + 0.5) * branchWidth;
    const rightLength = (Math.random() * 0.5 + 0.5) * len;
    const rightWidth = (Math.random() * 0.5 + 0.5) * branchWidth;

    drawTree(graphics, startX + dx, startY - dy, angle, leftLength, leftWidth, color1, color2, 'left');
    drawTree(graphics, startX + dx, startY - dy, angle, rightLength, rightWidth, color1, color2, 'right');
    graphics.restore();
}




