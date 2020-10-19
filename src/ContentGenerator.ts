import Phaser from 'phaser';
import MountainScene from './MountainScene';
import createForeground from './CreateForeground';


export default class ContentGenerator{
    scene: MountainScene;
    totalWidth: number;
    totalHeight: number;
    backgroundType: string;

    constructor(scene: MountainScene, totalWidth: number, totalHeight: number, backgroundType: string){
        this.scene = scene
        this.totalWidth = totalWidth;
        this.totalHeight = totalHeight;
        this.backgroundType = backgroundType;
    } 

    createLevel = (): void => {
        this.createBackground();
        createForeground(this.scene, this.totalHeight);    
    }

    createBackground = (): void => {

        if(this.backgroundType==='sparse'){        
            this.createBackgroundLayer('backgroundLayer0', 0, 0.05, 0.05);
            this.createBackgroundLayer('backgroundLayer1', 250, 0.1, 0.1);
            this.createBackgroundLayer('backgroundLayer2', 150, 0.2, 0.2);
            this.createBackgroundLayer('backgroundLayer3', -30, 0.4, 0.4);
        }
        
        else{
            this.createBackgroundLayer('backgroundLayer0b', 0.05, 0.05);
            this.createBackgroundLayer('backgroundLayer1b', 0.2, 0.2);
            this.createBackgroundLayer('backgroundLayer2b', 0.4, 0.4);
            this.createBackgroundLayer('backgroundLayer3b', 1, 1);
        }
       //console.log('camera position:', this.scene.cameras.main.x, this.scene.cameras.main.y);
    }

    createBackgroundLayer = (texture: string, heightOffset: number, scrollFactorX: number, scrollFactorY: number): void => {
        const width = this.scene.textures.get(texture).getSourceImage().width;
        //const height = this.scene.textures.get(texture).getSourceImage().height;
        const scrollAmount = this.scene.maxGameHeight - this.scene.cameras.main.height;
        const count = Math.ceil(this.totalWidth/width * scrollFactorX) + 1;
        //console.log('width:', width, 'count:', count, 'totalWidth:', this.totalWidth, 'totalHeight', this.totalHeight);
        let x = 0;
        //let prevHeight = 0;
        const offsetY = 50;
        for(let i=0; i<count; ++i){
            let temp = this.scene.add.image(x, scrollFactorY * scrollAmount + this.scene.cameras.main.height + offsetY + heightOffset, texture)
                            .setScrollFactor(scrollFactorX, scrollFactorY)
                            .setOrigin(0,1);
            x += temp.width;
        }
    }

    


    createForeground = (): void => {
        
        // y coordinate relative to the bottom of the map
        // scroll factors should be larger than 0.5
       //this.makeTree(600, -64, 0.6, 1);
        // this.makeTree(700, -64, 0.5, 0.5);
        // this.makeTree(800, -64, 0.7, 0.7);
        this.scene.add.image(100, this.scene.maxGameHeight-100, 'environmentAtlas', 'chest_closed').setScale(0.75);
    }



}



