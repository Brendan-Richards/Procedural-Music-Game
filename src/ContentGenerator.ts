import MountainScene from './MountainScene';
import createForeground from './CreateForeground';


export default class ContentGenerator{
    scene: MountainScene;

    constructor(scene: MountainScene){
        this.scene = scene
    } 

    createLevel = (): void => {
        this.createBackground();
        createForeground(this.scene);   
        
    }

    createBackground = (): void => {

        const scrollAmount = this.scene.maxGameHeight - this.scene.cameras.main.height;
        const offsetY = 66;
        //scrollFactorY * scrollAmount + this.scene.cameras.main.height + offsetY
        this.scene.add.image(0, 0.1 * scrollAmount + this.scene.cameras.main.height - offsetY - 30, 'grayBackground')
            .setOrigin(0, 1)
            .setScrollFactor(0.1, 0.1);

        const leafColor1 = 100
        const branchColor1 = 100;
        const leafColor2 = 150;
        const branchColor2 = 150;
        const leafColor3 = 190;
        const branchColor3 = 190;

        this.createTreeLayer(Phaser.Display.Color.GetColor(branchColor1, branchColor1, branchColor1), Phaser.Display.Color.GetColor(leafColor1, leafColor1, leafColor1), 0.2, 0.2);
        this.createTreeLayer(Phaser.Display.Color.GetColor(branchColor2, branchColor2, branchColor2), Phaser.Display.Color.GetColor(leafColor2, leafColor2, leafColor2), 0.4, 0.4);
        this.createTreeLayer(Phaser.Display.Color.GetColor(branchColor3, branchColor3, branchColor3), Phaser.Display.Color.GetColor(leafColor3, leafColor3, leafColor3), 0.6, 0.6);
    
    }

    createTreeLayer = (branchColor: Phaser.Display.Color, leafColor: Phaser.Display.Color, scrollFactorX: number, scrollFactorY: number) => {
        const layer: {key, rootX}[] = [];
        const maxTrees = 10;
        const numTrees = Math.floor(Math.random() * (maxTrees-3)) + 3;

        for(let i=0; i<numTrees; i++){
            const graphics = this.scene.add.graphics({x: 0, y: 0, add: false});

            const bounds = {
                left: this.scene.maxGameWidth, 
                right: 0, 
                top: this.scene.maxGameHeight, 
                bottom: this.scene.maxGameHeight
            }
    
            this.drawTree(graphics, this.scene.maxGameWidth * 0.5, this.scene.maxGameHeight, 0, 100, 10, branchColor, leafColor, 'right', bounds, true);
            
            const treeKey = this.getRandomText();
    
            graphics.generateTexture(treeKey, bounds.right, this.scene.maxGameHeight);
    
            layer.push({key: treeKey, rootX: this.scene.maxGameWidth * 0.5 / bounds.right});
    
            //this.scene.add.rectangle(bounds.left, bounds.top, bounds.right-bounds.left, bounds.bottom-bounds.top, 0xff0000, 0.5).setOrigin(0,0);
            graphics.clear();

            const scrollAmount = this.scene.maxGameHeight - this.scene.cameras.main.height;
            //console.log('camera height:', this.scene.cameras.main.height);
            //console.log('scroll amount:', scrollAmount);
            const offsetY = 66;
            //scrollFactorY * scrollAmount + this.scene.cameras.main.height + offsetY
            const posX = Math.floor(Math.random()*(this.scene.maxGameWidth-300))+ 150;
            //const posY = scrollFactorY * scrollAmount + this.scene.cameras.main.height - 70;
            const posY = 420 * scrollFactorY + 380; // from linear equation
           //console.log('posY:', posY);
            this.scene.add.sprite(posX, posY, treeKey)
                .setOrigin(layer[i].rootX, 1)
                .setScale(this.scene.treeScaleFactor)
                .setScrollFactor(scrollFactorX, scrollFactorY);
        }
        this.scene.trees.push(layer);
    }

    getRandomText = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    drawTree(graphics: Phaser.GameObjects.Graphics,
                    startX, 
                    startY, 
                    prevAngle, 
                    len, 
                    branchWidth, 
                    color1, 
                    color2, 
                    direction,
                    bounds,
                    root = false) {

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
            this.checkBounds(startX + dx + leafWidth, startY - dy - leafHeight, bounds);
            this.checkBounds(startX + dx - leafWidth, startY - dy - leafHeight, bounds);
            graphics.restore();
            return;
        }
        else{
            this.checkBounds(startX + dx, startY - dy, bounds);
        }

        const leftLength = (Math.random() * 0.5 + 0.5) * len;
        const leftWidth = (Math.random() * 0.5 + 0.5) * branchWidth;
        const rightLength = (Math.random() * 0.5 + 0.5) * len;
        const rightWidth = (Math.random() * 0.5 + 0.5) * branchWidth;

        this.drawTree(graphics, startX + dx, startY - dy, angle, leftLength, leftWidth, color1, color2, 'left', bounds);
        this.drawTree(graphics, startX + dx, startY - dy, angle, rightLength, rightWidth, color1, color2, 'right', bounds);
        graphics.restore();
    }

    checkBounds = (x, y, bounds) => {
        //check if we need to update the bounds because (x, y) is outside of them
        if(x > bounds.right){
            bounds.right = x;
        }
        else if(x < bounds.left){
            bounds.left = x;
        }
        if(y < bounds.top){
            bounds.top = y;
        }
    }


}



