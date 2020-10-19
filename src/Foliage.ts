import MountainScene from './MountainScene';


const flatFoliage = (scene: MountainScene, x1: number, x2: number, y: number) => {
    console.log('called flatFoliage with params:', x1, x2, y);
    //untis of trees per tile block
    const maxTreeDensity = 0.75;
    const numTiles = (x2-x1)/64;
    const numTrees = Math.floor(Math.random() * maxTreeDensity * numTiles);

    console.log('numTiles:', numTiles, 'numTrees:', numTrees);

    let treeCoordinates: [number[]] = [];

    for(let i=0; i < numTrees; i++){
        let location = 0;
        let validLocation = false;
        while(!validLocation){
            location = Math.floor(Math.random() * (x2-x1)) + x1;
            validLocation = true;
            for(let j=0; j<treeCoordinates.length; j++){
                if(location < treeCoordinates[j][1] && location > treeCoordinates[j][0] ||
                   location + 25 < treeCoordinates[j][1] && location + 25 > treeCoordinates[j][0]){
                    validLocation = false;
                    break;
                }
            }
        }
        treeCoordinates.push([location-2, location+23]);
        createTree(scene, location, y - scene.maxGameHeight, 1, 1);
        console.log('putting tree at x:', location, 'y:', y);
    }
}

const createTree = (scene: MountainScene, x: number, y: number, scrollFactorX: number, scrollFactorY: number): void => {
        const scrollAmount = scene.maxGameHeight - scene.cameras.main.height;
        const offsetY = scrollFactorY * scrollAmount + scene.cameras.main.height;

        const randomOffsetY = Math.floor(Math.random() * 20);
        let treeType = 'tree_premade';
        let maxTreeNum = 8;

        if(Math.random() < 0.15){
            treeType = 'tree_micro';
            maxTreeNum = 4;
        }

        const treeNum = Math.floor(Math.random() * maxTreeNum).toString();
        const stump = scene.add.sprite(x, offsetY + y + randomOffsetY, 'environmentAtlas', treeType + treeNum)
            .setScrollFactor(scrollFactorX, scrollFactorY)
            .setOrigin(0,1);
}

// const createTree = (scene: MountainScene, x: number, y: number, scrollFactorX: number, scrollFactorY: number): void => {
//     const scrollAmount = scene.maxGameHeight - scene.cameras.main.height;
//     const offsetY = scrollFactorY * scrollAmount + scene.cameras.main.height;

//     // y += scrollFactorY * this.scene.cameras.main.height;

//     const stump = scene.add.sprite(x, offsetY + y , 'environmentAtlas', 'tree_skinny_stump1')
//         .setScrollFactor(scrollFactorX, scrollFactorY)
//         .setOrigin(0,1);
//     y -= stump.height;

//     console.log('setting bottom left coordinate of stump:', x, offsetY + y)

//     const stumpAngle = 5;
//     let stumpOffsetX = Math.ceil(Math.sin(stumpAngle/180 * Math.PI) * stump.height); 
//     let stumpOffsetY = Math.ceil(stump.height * (1 - Math.cos(stumpAngle/180 * Math.PI)));

//     console.log('stumpOffsetY is:', stumpOffsetY);
//     console.log('bottom left coordinate of stump:', stump.getBottomLeft().x, stump.getBottomLeft().y)

//     //stump;

//     if(stumpAngle < 0){
//         stump.setY(stump.getBottomLeft().y + stumpOffsetY);
//         //stumpOffsetY *= 2;
//     }
//     else if(stumpAngle > 0){
//     //    stump.setOrigin(1,1).setX(stump.getBottomRight().x);
//         //stump.setOrigin(1,1).setY(stump.getBottomRight().y + stumpOffsetY);
//        // stumpOffsetY += stumpOffsetY;
//     }
//     stumpOffsetY *= 2;
//     stump.angle = stumpAngle;
    

//     let bodyOffsetX = 0;
//     let bodyOffsetY = 0;
//     let bodyAngle = stumpAngle;
//     const maxBodyPieces = 4;
//     //const numBodyPieces = Math.floor(Math.random() * maxBodyPieces) + 1;
//     const numBodyPieces = 1;
//     for(let i = 0; i < numBodyPieces; i++){
//         // const body = scene.add.image(x + stumpOffsetX + bodyOffsetX, offsetY + y + 2 * stumpOffsetY - bodyOffsetY, 'environmentAtlas', 'tree_skinny_body')
//         //     .setScrollFactor(scrollFactorX, scrollFactorY)
//         //     .setOrigin(0,1); 
//         let body;
//         if(bodyAngle > 0){
//             body = scene.add.image(x + stumpOffsetX, offsetY + y + stumpOffsetY, 'environmentAtlas', 'tree_skinny_body')
//                 .setScrollFactor(scrollFactorX, scrollFactorY)
//                 .setOrigin(0,1); 
//             body.angle = bodyAngle;
//         }
//         else{
//             body = scene.add.image(x + stumpOffsetX, offsetY + y + stumpOffsetY, 'environmentAtlas', 'tree_skinny_body')
//                 .setScrollFactor(scrollFactorX, scrollFactorY)
//                 .setOrigin(0,1); 
//         }


//         //body.angle = stumpAngle;

//         bodyOffsetX += Math.ceil(Math.sin(bodyAngle/180 * Math.PI) * body.height); 
//         //bodyOffsetY += Math.ceil(body.width * Math.sin(bodyAngle/180 * Math.PI));
//         bodyOffsetY += Math.ceil(body.height * (1 - Math.cos(bodyAngle/180 * Math.PI)));

//         const newBodyAngle = 5;

//         // if(newBodyAngle > 0 && bodyAngle < 0){
//         //     stump.setY(stump.getBottomLeft().y - stumpOffsetY);
//         //     stumpOffsetY *= 2;
//         // }
    
//         // stump.angle = stumpAngle;
        
//         y -= body.height; 
//     }

//     //console.log('putting tree top at:', x, y);
//     const bodyTopOffset = -7;
//     scene.add.image(x + bodyTopOffset + stumpOffsetX + bodyOffsetX, offsetY + y + stumpOffsetY + bodyOffsetY, 'environmentAtlas', 'tree_skinny_top1')
//         .setScrollFactor(scrollFactorX, scrollFactorY)
//         .setOrigin(0,1);        
     
// }

const verticalFoliage = () => {

}

export {flatFoliage, verticalFoliage};