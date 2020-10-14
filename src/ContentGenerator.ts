import Phaser from 'phaser';
import MountainScene from './MountainScene';
import createTileMap from './CreateTilemap';


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
        this.createForeground();
        createTileMap(this.scene, this.totalHeight);    
    }

    createBackground = (): void => {

        if(this.backgroundType==='sparse'){           
           this.createBackgroundLayer('backgroundLayer0', 0.01, 0.01);
           this.createBackgroundLayer('backgroundLayer1', 0.1, 0.1);
           this.createBackgroundLayer('backgroundLayer2', 0.2, 0.2);
           this.createBackgroundLayer('backgroundLayer3', 0.3, 0.3);
        }
        
        else{
            this.createBackgroundLayer('backgroundLayer0b', 0.1, 1);
            this.createBackgroundLayer('backgroundLayer1b', 0.2, 1);
            this.createBackgroundLayer('backgroundLayer2b', 0.3, 1);
            this.createBackgroundLayer('backgroundLayer3b', 0.4, 1);
        }
        console.log('camera position:', this.scene.cameras.main.x, this.scene.cameras.main.y);
    }

    createBackgroundLayer = (texture: string, scrollFactorX: number, scrollFactorY: number): void => {
        const width = this.scene.textures.get(texture).getSourceImage().width;
        const scrollAmount = this.scene.maxGameHeight - this.scene.cameras.main.height;
        const count = Math.ceil(this.totalWidth/width * scrollFactorX) + 1;
        console.log('width:', width, 'count:', count, 'totalWidth:', this.totalWidth, 'totalHeight', this.totalHeight);
        let x = 0;
        for(let i=0; i<count; ++i){
            let temp = this.scene.add.image(x, scrollFactorY * scrollAmount + this.scene.cameras.main.height, texture)
                            .setScrollFactor(scrollFactorX, scrollFactorY)
                            .setOrigin(0,1);
            x += temp.width;
        }
    }

    


    createForeground = (): void => {
        
    }

}



