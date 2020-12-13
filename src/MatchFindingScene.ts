// import Phaser from 'phaser';
import { io } from 'socket.io-client';
import noScroll from './NoScroll.js';

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

        //if the game canvas doesn't have a wrapping div, then we must need to build the info sections
        if(this.game.canvas.parentNode.isSameNode(document.body)){
            placeInformation(this);
        }

        document.body.removeEventListener('scroll', noScroll);

        this.input.mouse.disableContextMenu();

        this.foundMatch = false;

        this.socket = io();
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');

        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        this.findMatchButton = this.add.rectangle(width/2, height - 113, 200, 50, 0xcccccc);
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
            }).setOrigin(0, 1);  

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

function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

const placeInformation = (scene: MatchFindingScene) => {
    //let canvas = document.getElementsByTagName("p");

    //wrap canvas in a div
    let canvas = scene.game.canvas;
    let wrapper = document.createElement('div');
    wrapper.id = 'canvasWrapper';
    document.body.insertBefore(wrapper, canvas);
    wrapper.appendChild(canvas);

    //put info div after canvas
    let infoDiv = document.getElementById("info");
    document.body.insertBefore(wrapper, infoDiv);
    //document.body.setAttribute('style', 'overflow-y: scroll;');
    // document.style.overflow = 'scroll';
    
    //set properties of info div
    infoDiv.setAttribute('style', 'height: 500px;');

    const {aboutDiv, controlsDiv, attributionDiv} = getDivs();
    const {aboutButton, controlsButton, attributionButton} = getButtons();

    const linkDiv = document.createElement('div');
    linkDiv.id = 'linkDiv';
    linkDiv.appendChild(aboutButton);
    linkDiv.appendChild(controlsButton);
    linkDiv.appendChild(attributionButton);
    infoDiv.appendChild(linkDiv);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'contentDiv';
    contentDiv.appendChild(aboutDiv);
    contentDiv.appendChild(controlsDiv);
    contentDiv.appendChild(attributionDiv);
    infoDiv.appendChild(contentDiv);

    document.getElementById("defaultOpen").click();
}

const getButtons = () => {
    const aboutButton = document.createElement('button');
    aboutButton.className = 'tablink';
    aboutButton.textContent = 'About';
    aboutButton.id = 'defaultOpen';
    aboutButton.addEventListener('click', () => {
        openPage('about', aboutButton, '#F1F1F1');
    });

    const controlsButton = document.createElement('button');
    controlsButton.className = 'tablink';
    controlsButton.textContent = 'Controls';
    controlsButton.addEventListener('click', () => {
        openPage('controls', controlsButton, '#F1F1F1');
    });

    const attributionButton = document.createElement('button');
    attributionButton.className = 'tablink';
    attributionButton.textContent = 'Credits';
    attributionButton.addEventListener('click', () => {
        openPage('attribution', attributionButton, '#F1F1F1');
    });

    return {aboutButton: aboutButton, controlsButton: controlsButton, attributionButton: attributionButton};
}

const getDivs = () => {
    const aboutDiv = document.createElement('div');
    aboutDiv.className = 'tabcontent';
    aboutDiv.innerHTML = '<h3>about content</h3>';
    aboutDiv.id = 'about';
  
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'tabcontent';
    controlsDiv.innerHTML = '<h3>controls content</h3>';
    controlsDiv.id = 'controls';

    const attributionDiv = document.createElement('div');
    attributionDiv.className = 'tabcontent';
    attributionDiv.innerHTML = '<h3>attribution content</h3>';
    attributionDiv.id = 'attribution';

    return {aboutDiv: aboutDiv, controlsDiv: controlsDiv, attributionDiv: attributionDiv};
}



